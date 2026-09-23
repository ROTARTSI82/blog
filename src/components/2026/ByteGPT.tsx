import React, { useEffect, useState, useRef } from 'react';

/**
 ### 1. Scaling vs Softmax Percentages (isRaw = false)

  • If Scale by ||V|| is OFF: We show the traditional Softmax Percentage (the standard attention weight). They sum perfectly to 100%.
  • If Scale by ||V|| is ON: Showing a "softmax percentage" of a scaled vector doesn't make sense since softmax * ||V|| is a magnitude. The percentage now represents the
  fraction of the total vector magnitude that a token contributed to the current attention head output. This is mathematically meaningful—it measures how "loud" the token's
  signal is relative to the total "noise + signal" added into the accumulator. This gracefully sums to 100%.

  ### 2. Raw vs Scaled Values (isRaw = true)

  • If Scale by ||V|| is OFF: We show the true Pre-Softmax dot product scores (QK^T / sqrt(d)). These can be negative and unbounded.
  • If Scale by ||V|| is ON: We show the Scaled Magnitude (softmax_weight * ||V||). This is always a positive number and directly represents the L2 length of the value vector
  after it was dampened by the attention mechanism.
*/

function sampleLogits(logits, temp, topK) {
    if (temp <= 0) {
        let maxI = 0;
        let maxV = -Infinity;
        for(let i=0; i<256; i++) {
            if (logits[i] > maxV) { maxV = logits[i]; maxI = i; }
        }
        return maxI;
    }
    
    let l = new Float32Array(logits);
    for(let i=0; i<256; i++) l[i] /= temp;
    
    if (topK > 0) {
        let sorted = Array.from(l).sort((a,b) => b-a);
        let cutoff = sorted[Math.min(topK, 256) - 1];
        for(let i=0; i<256; i++) if(l[i] < cutoff) l[i] = -Infinity;
    }
    
    let maxV = -Infinity;
    for(let i=0; i<256; i++) if(l[i] > maxV) maxV = l[i];
    
    let sum = 0;
    let probs = new Float32Array(256);
    for(let i=0; i<256; i++) {
        probs[i] = Math.exp(l[i] - maxV);
        sum += probs[i];
    }
    
    let r = Math.random() * sum;
    let acc = 0;
    for(let i=0; i<256; i++) {
        acc += probs[i];
        if (r <= acc) return i;
    }
    return 255;
}

function getHighlightColor(prob) {
    if (prob === undefined) return 'transparent';
    let p = Math.max(1e-9, Math.min(1, prob));
    let nll = -Math.log(p);
    // Proportion to -log(p). Map roughly 0-6 nll to 0-0.9 alpha.
    let alpha = Math.min(0.9, nll * 0.15); 
    return `rgba(255, 120, 0, ${alpha})`;
}

const ByteGPTApp = ({ weightsBuffer }) => {
    const [ready, setReady] = useState(false);
    const [text, setText] = useState(`float Q_rsqrt(float number)
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;`);
    const [temp, setTemp] = useState(0.8);
    const [topK, setTopK] = useState(40);
    const [stats, setStats] = useState({ tokPerSec: 0, entropy: 0 });
    const [cursorPos, setCursorPos] = useState(0); // string cursor index
    const [isInferring, setIsInferring] = useState(false);
    
    const [inspectData, setInspectData] = useState(null);
    const [layer, setLayer] = useState(0);
    const [head, setHead] = useState(0);
    const [showRaw, setShowRaw] = useState(false);
    const [hoveredAttn, setHoveredAttn] = useState(null);
    
    const backdropRef = useRef(null);
    
    const engineRef = useRef({
        bytes: new Uint8Array(0),
        probs: [], 
        engineCursor: 0, 
        lastTypeTime: Date.now(),
        totalNLL: 0,
        startTime: Date.now(),
        tokCount: 0,
        lastInspectPos: -1,
        hasInitSink: false
    });
    
    const targetBytesRef = useRef(new Uint8Array(0));
    const tempRef = useRef(temp);
    const topKRef = useRef(topK);
    const inspectStrPosRef = useRef(cursorPos);
    const isInferringRef = useRef(isInferring);
    
    const [renderTick, setRenderTick] = useState(0);

    // Initial setup of targetBytes
    useEffect(() => {
        targetBytesRef.current = new TextEncoder().encode(text);
    }, []);
    
    useEffect(() => {
        tempRef.current = temp;
        topKRef.current = topK;
        inspectStrPosRef.current = cursorPos;
        isInferringRef.current = isInferring;
    }, [temp, topK, cursorPos, isInferring]);

    useEffect(() => {
        const init = async () => {
            if (window.Module && window.Module.ccall) {
                loadModel();
            } else {
                const listener = () => loadModel();
                window.addEventListener('wasmLoaded', listener);
                return () => window.removeEventListener('wasmLoaded', listener);
            }
        };
        
        const loadModel = async () => {
            try {
                if (!window.Module._malloc) return;
                 
                const buffer = weightsBuffer;
                const bytes = new Uint8Array(buffer);
                const weightsPtr = window.Module._malloc(bytes.length);
                window.Module.HEAPU8.set(bytes, weightsPtr);
                window.Module.ccall('init_engine', null, ['number'], [weightsPtr]);
                setReady(true);
            } catch(e) {
                console.error(e);
            }
        };
        
        init();
    }, []);
    
    useEffect(() => {
        if (!ready) return;
        
        let active = true;
        const decoder = new TextDecoder('utf-8', { fatal: false });
        
        const loop = () => {
            if (!active) return;
            
            const state = engineRef.current;
            const targetBytes = targetBytesRef.current;
            
            let changed = false;
            
            if (!state.hasInitSink) {
                window.Module.ccall('seek', 'number', ['number'], [0]);
                window.Module.ccall('predict_next', 'number', ['number'], [0]);
                state.hasInitSink = true;
                changed = true;
            }
            
            let diffIdx = 0;
            while (diffIdx < targetBytes.length && diffIdx < state.bytes.length && targetBytes[diffIdx] === state.bytes[diffIdx]) {
                diffIdx++;
            }
            
            if (diffIdx < state.bytes.length) {
                if (Date.now() - state.lastTypeTime < 300) {
                    requestAnimationFrame(loop);
                    return; 
                }
                state.bytes = state.bytes.slice(0, diffIdx);
                state.probs = state.probs.slice(0, diffIdx);
                
                if (diffIdx > 0) {
                    window.Module.ccall('seek', 'number', ['number'], [diffIdx]);
                    window.Module.ccall('predict_next', 'number', ['number'], [targetBytes[diffIdx - 1]]);
                } else {
                    window.Module.ccall('seek', 'number', ['number'], [0]);
                    window.Module.ccall('predict_next', 'number', ['number'], [0]);
                }
                state.engineCursor = diffIdx;
                
                state.totalNLL = 0;
                for(let i = 0; i < state.probs.length; i++) {
                    if (state.probs[i] > 0) state.totalNLL -= Math.log2(state.probs[i]);
                }
                changed = true;
            }
            
            let charsProcessed = 0;
            while (state.bytes.length < targetBytes.length && charsProcessed < 5) {
                if (state.engineCursor !== state.bytes.length) {
                    if (state.bytes.length > 0) {
                        window.Module.ccall('seek', 'number', ['number'], [state.bytes.length]);
                        window.Module.ccall('predict_next', 'number', ['number'], [targetBytes[state.bytes.length - 1]]);
                    } else {
                        window.Module.ccall('seek', 'number', ['number'], [1]);
                    }
                    state.engineCursor = state.bytes.length;
                }
                
                let nextByte = targetBytes[state.bytes.length];
                let prob = 1.0;
                
                let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                let logits = new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256);
                
                let maxLogit = -Infinity;
                for(let i=0; i<256; i++) if(logits[i] > maxLogit) maxLogit = logits[i];
                let sum = 0;
                let t = tempRef.current || 1.0;
                for(let i=0; i<256; i++) sum += Math.exp((logits[i] - maxLogit) / t);
                prob = Math.exp((logits[nextByte] - maxLogit) / t) / sum;
                
                state.probs.push(prob);
                if (prob > 0) state.totalNLL -= Math.log2(prob);
                
                window.Module.ccall('predict_next', 'number', ['number'], [nextByte]);
                state.engineCursor++;
                
                let newBytes = new Uint8Array(state.bytes.length + 1);
                newBytes.set(state.bytes);
                newBytes[state.bytes.length] = nextByte;
                state.bytes = newBytes;
                
                state.tokCount++;
                charsProcessed++;
                changed = true;
                
                let now = performance.now();
                if (!state.tokenTimes) {
                    state.tokenTimes = [];
                    state.lastComputedTps = 0;
                }
                if (state.tokenTimes.length > 0) {
                    let dtGap = now - state.tokenTimes[state.tokenTimes.length - 1];
                    if (dtGap > 1000) state.tokenTimes = [];
                }
                state.tokenTimes.push(now);
                if (state.tokenTimes.length > 50) state.tokenTimes.shift();
            }
            
            if (isInferringRef.current && targetBytes.length < 4096 && state.bytes.length === targetBytes.length) {
                if (state.engineCursor !== state.bytes.length) {
                    if (state.bytes.length > 0) {
                        window.Module.ccall('seek', 'number', ['number'], [state.bytes.length]);
                        window.Module.ccall('predict_next', 'number', ['number'], [targetBytes[state.bytes.length - 1]]);
                    } else {
                        window.Module.ccall('seek', 'number', ['number'], [1]);
                    }
                    state.engineCursor = state.bytes.length;
                }
                
                let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                let logits = new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256);
                
                let nextByte = sampleLogits(logits, tempRef.current, topKRef.current);
                
                let newTarget = new Uint8Array(targetBytes.length + 1);
                newTarget.set(targetBytes);
                newTarget[targetBytes.length] = nextByte;
                targetBytesRef.current = newTarget;
                
                let newText = decoder.decode(newTarget);
                setText(newText);
                
                state.lastTypeTime = Date.now();
            }
            
            let textToCursor = textRef.current.substring(0, inspectStrPosRef.current);
            let bytePos = new TextEncoder().encode(textToCursor).length;
            
            if (state.bytes.length === targetBytes.length && bytePos !== state.lastInspectPos) {
                state.lastInspectPos = bytePos;
                
                if (bytePos >= 0 && bytePos <= state.bytes.length) {
                    if (bytePos > 0) {
                        window.Module.ccall('seek', 'number', ['number'], [bytePos]);
                        window.Module.ccall('predict_next', 'number', ['number'], [targetBytes[bytePos - 1]]);
                    } else {
                        window.Module.ccall('seek', 'number', ['number'], [0]);
                        window.Module.ccall('predict_next', 'number', ['number'], [0]);
                    }
                    state.engineCursor = bytePos;
                    
                    let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                    let logitsCopy = new Float32Array(new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256));
                    
                    let statsPtr = window.Module.ccall('get_stats', 'number', [], []);
                    let statsCopy = new Float32Array(new Float32Array(window.Module.HEAPF32.buffer, statsPtr, 24 * 8 * 4096));
                   
                    setInspectData({ logits: logitsCopy, stats: statsCopy, pos: bytePos });
                } else {
                    setInspectData(null);
                }
            }
            
            if (changed) {
                setRenderTick(t => t + 1);
                
                if (state.tokenTimes && state.tokenTimes.length > 1) {
                    let dt = (state.tokenTimes[state.tokenTimes.length - 1] - state.tokenTimes[0]) / 1000;
                    if (dt > 0) {
                        state.lastComputedTps = (state.tokenTimes.length - 1) / dt;
                    }
                }
                
                setStats({
                    tokPerSec: state.lastComputedTps || 0,
                    entropy: state.probs.length > 0 ? state.totalNLL / state.probs.length : 0
                });
            }
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
        return () => { active = false; };
    }, [ready]);

    // Track textRef for the byte cursor mapping
    const textRef = useRef(text);
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            setHead(_ => 0);
            setLayer(l => Math.min(23, l + 1));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            setHead(_ => 0);
            setLayer(l => Math.max(0, l - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            setHead(h => Math.max(0, h - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            setHead(h => Math.min(7, h + 1));
            e.preventDefault();
        }
    };

    const getTopLogitsInfo = (logitsArray, isRaw) => {
        let t = temp || 1.0;
        let maxL = -Infinity;
        for(let i=0; i<256; i++) if(logitsArray[i] > maxL) maxL = logitsArray[i];
        let sum = 0;
        let probs = new Float32Array(256);
        for(let i=0; i<256; i++) {
            probs[i] = Math.exp((logitsArray[i] - maxL) / t);
            sum += probs[i];
        }
        let items = [];
        for(let i=0; i<256; i++) {
            let char = String.fromCharCode(i);
            if (i === 10) char = '\\n';
            else if (i === 13) char = '\\r';
            else if (i === 9) char = '\\t';
            else if (i < 32 || i > 126) char = `\\x${i.toString(16).padStart(2, '0')}`;
            items.push({ char, val: isRaw ? logitsArray[i] : probs[i]/sum, idx: i });
        }
        items.sort((a, b) => b.val - a.val);
        return items.slice(0, 10);
    };

    const renderHighlights = () => {
        let spans = [];
        let i = 0;
        let decoder = new TextDecoder('utf-8', { fatal: false });
        let probs = engineRef.current.probs;
        let bytes = targetBytesRef.current;
        
        while (i < bytes.length) {
            let byte = bytes[i];
            let len = 1;
            if ((byte & 0x80) === 0) len = 1;
            else if ((byte & 0xE0) === 0xC0) len = 2;
            else if ((byte & 0xF0) === 0xE0) len = 3;
            else if ((byte & 0xF8) === 0xF0) len = 4;
            
            if (i + len > bytes.length) len = bytes.length - i;
            
            let chunk = bytes.subarray(i, i + len);
            let charStr = decoder.decode(chunk);
            
            let prob = 1.0;
            for (let j = 0; j < len; j++) {
                if (i + j < probs.length) {
                    let p = probs[i + j];
                    if (p !== undefined) prob *= p;
                } else {
                    prob = undefined;
                    break;
                }
            }
            
            spans.push(<span key={i} style={{backgroundColor: getHighlightColor(prob)}}>{charStr}</span>);
            i += len;
        }
        
        if (text.endsWith('\n')) spans.push(<br key="br" />);
        return spans;
    };

    const renderAttentionText = (pos, stats, layer, head, isRaw) => {
        if (!stats || pos < 0) return null;
        let offset = layer * 8 * 4096 + head * 4096;
        let bytes = targetBytesRef.current.subarray(0, pos);
        
        let contextLen = pos + 1;
        let rawDots = new Float32Array(contextLen);
        let maxRaw = -Infinity;
        for (let i = 0; i < contextLen; i++) {
            rawDots[i] = stats[offset + i];
            if (rawDots[i] > maxRaw) maxRaw = rawDots[i];
        }
        
        let probs = new Float32Array(contextLen);
        let sum = 0;
        for (let i = 0; i < contextLen; i++) {
            probs[i] = Math.exp(rawDots[i] - maxRaw);
            sum += probs[i];
        }
        
        let weights = new Float32Array(contextLen);
        let weightSum = 0;
        for (let i = 0; i < contextLen; i++) {
            let p = probs[i] / sum;
            weights[i] = p;
            weightSum += weights[i];
        }
        
        let maxWeight = 0;
        for (let i = 0; i < contextLen; i++) {
            if (weights[i] > maxWeight) maxWeight = weights[i];
        }
        
        let spans = [];
        let renderSpan = (charStr, charMaxWeight, charMaxRaw, keyIdx) => {
            let titleText;
            
            if (isRaw) {
                titleText = charMaxRaw.toFixed(4) + ' (Pre-Softmax)';
            } else {
                let frac = weightSum > 1e-9 ? charMaxWeight / weightSum : 0;
                titleText = (frac * 100).toFixed(2) + '%';
            }
            
            let norm = maxWeight > 1e-9 ? charMaxWeight / maxWeight : 0;
            // Map 0 to Gray (128, 128, 128) and 1 to Yellow (255, 255, 0)
            let r = Math.round(128 + 127 * norm);
            let g = Math.round(128 + 127 * norm);
            let b = Math.round(128 * (1 - norm));
            
            let displayStr = charStr;
            let style = { color: `rgb(${r}, ${g}, ${b})`, cursor: 'crosshair' };
            
            if (charStr === '\0') { 
                displayStr = '∅';
                style.border = '1px solid rgba(255,255,255,0.3)';
                style.borderRadius = '2px';
                style.padding = '0 2px';
                style.margin = '0 1px';
                style.backgroundColor = 'rgba(255,255,255,0.1)';
            } else if (charStr === ' ') {
                displayStr = ' ';
                style.borderBottom = '1px solid rgba(255,255,255,0.4)';
                style.backgroundColor = 'rgba(255,255,255,0.05)';
            } else if (charStr === '\n') {
                displayStr = '↵\n';
                style.opacity = 0.8;
            } else if (charStr === '\t') {
                displayStr = '→';
            } else if (charStr === '\r') {
                displayStr = '←';
            } else if (charStr.length === 1 && charStr.charCodeAt(0) < 32) {
                displayStr = '';
            }
            
            return (
                <span key={keyIdx} 
                      style={style}
                      onMouseEnter={() => setHoveredAttn({ char: charStr === '\0' ? '[NULL]' : charStr, val: titleText })}
                      onMouseLeave={() => setHoveredAttn(null)}
                >
                    {displayStr}
                </span>
            );
        };
        
        spans.push(renderSpan('\0', weights[0], rawDots[0], -1));
        
        let i = 0;
        let decoder = new TextDecoder('utf-8', { fatal: false });
        
        while (i < bytes.length) {
            let byte = bytes[i];
            let len = 1;
            if ((byte & 0x80) === 0) len = 1;
            else if ((byte & 0xE0) === 0xC0) len = 2;
            else if ((byte & 0xF0) === 0xE0) len = 3;
            else if ((byte & 0xF8) === 0xF0) len = 4;
            
            if (i + len > bytes.length) len = bytes.length - i;
            
            let chunk = bytes.subarray(i, i + len);
            let charStr = decoder.decode(chunk);
            
            let charMaxWeight = 0;
            let charMaxRaw = -Infinity;
            for (let j = 0; j < len; j++) {
                let idx = i + j + 1;
                if (weights[idx] > charMaxWeight) charMaxWeight = weights[idx];
                if (rawDots[idx] > charMaxRaw) charMaxRaw = rawDots[idx];
            }
            
            spans.push(renderSpan(charStr, charMaxWeight, charMaxRaw, i));
            i += len;
        }
        return spans;
    };

    if (!ready) {
        return <div className="p-4 text-center">Loading WebAssembly Model...</div>;
    }

    return (
        <div className="flex flex-col gap-4 h-[80vh] overflow-hidden bg-white text-black text-sm">
            <div className="flex gap-4 items-center bg-gray-100 p-2 rounded border border-gray-300">
                <div className="flex items-center gap-2">
                    <label className="mr-1">Temp: {temp.toFixed(2)}</label>
                    <input type="range" min="0" max="2" step="0.05" className="w-24 align-middle" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label className="mr-2">Top K:</label>
                    <input type="number" className="w-16 border rounded px-1" value={topK} onChange={e => setTopK(parseInt(e.target.value))} />
                </div>
                <div>
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={showRaw} onChange={e => setShowRaw(e.target.checked)} />
                        Show Raw
                    </label>
                </div>
                <div className="text-gray-700 ml-2">Tok/s: {stats.tokPerSec.toFixed(1)}</div>
                <div className="text-gray-700">Avg. entropy: {stats.entropy.toFixed(2)} bits</div>
                <button 
                    className={`px-3 py-1 text-white rounded ml-auto ${isInferring ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                    onClick={() => setIsInferring(!isInferring)}
                >
                    {isInferring ? 'Stop Inference' : 'Run Inference'}
                </button>
            </div>
            
            <div className="flex flex-1 gap-4 min-h-0">
                {/* Left Pane */}
                <div className="w-1/2 relative border border-gray-300 rounded bg-white overflow-hidden">
                    <div 
                        ref={backdropRef}
                        className="absolute top-0 left-0 w-full h-full overflow-y-auto pointer-events-none select-none"
                        style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            padding: '12px',
                            margin: 0,
                            border: 'none',
                            boxSizing: 'border-box',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: 'black'
                        }}
                    >
                        {renderHighlights()}
                    </div>
                    <textarea 
                        className="absolute top-0 left-0 w-full h-full bg-transparent resize-none outline-none overflow-y-auto"
                        style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            padding: '12px',
                            margin: 0,
                            border: 'none',
                            boxSizing: 'border-box',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: 'transparent',
                            caretColor: 'black'
                        }}
                        value={text}
                        onScroll={(e) => {
                            if (backdropRef.current) backdropRef.current.scrollTop = e.target.scrollTop;
                        }}
                        onChange={e => {
                            if (new TextEncoder().encode(e.target.value).length > 4096) return;
                            setText(e.target.value);
                            targetBytesRef.current = new TextEncoder().encode(e.target.value);
                            engineRef.current.lastTypeTime = Date.now();
                            setIsInferring(false);
                        }}
                        onSelect={e => {
                            setCursorPos(e.target.selectionStart);
                        }}
                        onClick={e => {
                            setCursorPos(e.target.selectionStart);
                        }}
                        onKeyUp={e => {
                            setCursorPos(e.target.selectionStart);
                        }}
                    />
                </div>
                
                {/* Right Pane */}
                <div className="w-1/2 flex flex-col gap-4 overflow-y-auto border border-gray-300 rounded p-4 font-mono outline-none focus:ring-2 focus:ring-blue-300" tabIndex={0} onKeyDown={handleKeyDown}>
                    {inspectData ? (
                        <>
                            <div>
                                <h3 className="font-bold mb-1">Logits for Next Token</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {getTopLogitsInfo(inspectData.logits, showRaw).map((x, i) => {
                                        const actualNextChar = targetBytesRef.current[inspectData.pos] || 256;
                                        return (
                                        <div key={i} className={`flex justify-between border-b border-gray-100 ${x.idx === actualNextChar ? 'bg-yellow-200 text-black px-1 font-bold rounded' : ''}`}>
                                            <span>'{x.char}'</span>
                                            <span className="text-gray-500">{showRaw ? x.val.toFixed(4) : (x.val*100).toFixed(1) + '%'}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold mb-1">Attention Scores (L{layer}, H{head})</h3>
                                <div className="text-xs text-gray-500 mb-1">
                                    Use Arrow Keys to change layer/head while focused here
                                </div>
                                <div className="h-6 mb-2">
                                    {hoveredAttn && (
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            '{hoveredAttn.char === '\n' ? '\\n' : hoveredAttn.char}': {hoveredAttn.val}
                                        </span>
                                    )}
                                </div>
                                <div className="whitespace-pre-wrap break-words bg-gray-900 p-3 rounded leading-relaxed text-base shadow-inner min-h-[100px]" onMouseLeave={() => setHoveredAttn(null)}>
                                    {renderAttentionText(inspectData.pos, inspectData.stats, layer, head, showRaw)}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 h-full flex items-center justify-center text-center">
                            Move cursor into text to inspect model state.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ByteGPTApp;
