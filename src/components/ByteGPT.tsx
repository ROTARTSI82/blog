import React, { useEffect, useState, useRef } from 'react';

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
    let p = Math.max(0, Math.min(1, prob));
    let surprise = 1 - p;
    let alpha = Math.pow(surprise, 1.5) * 0.8; 
    return `rgba(255, 120, 0, ${alpha})`;
}

const ByteGPTApp = () => {
    const [ready, setReady] = useState(false);
    const [text, setText] = useState("rotartsi 2026-04-03 13:44:55\nand so you get this proof of cantor's theorem\nrohan what do you think?\n\nchopinfan239 2026-04-03 13:45:06\nyou diagonalize? like");
    const [temp, setTemp] = useState(0.8);
    const [topK, setTopK] = useState(40);
    const [stats, setStats] = useState({ tokPerSec: 0, perplexity: 0 });
    const [cursorPos, setCursorPos] = useState(0);
    const [isInferring, setIsInferring] = useState(false);
    
    const [inspectData, setInspectData] = useState(null);
    const [layer, setLayer] = useState(0);
    const [head, setHead] = useState(0);
    const [showRaw, setShowRaw] = useState(false);
    
    const backdropRef = useRef(null);
    
    const engineRef = useRef({
        text: "",
        probs: [], 
        engineCursor: 0, 
        lastTypeTime: Date.now(),
        totalNLL: 0,
        startTime: Date.now(),
        tokCount: 0,
        lastInspectPos: -1
    });
    
    const textRef = useRef(text);
    const tempRef = useRef(temp);
    const topKRef = useRef(topK);
    const inspectPosRef = useRef(cursorPos);
    const isInferringRef = useRef(isInferring);
    
    const [renderTick, setRenderTick] = useState(0);
    
    useEffect(() => {
        textRef.current = text;
        tempRef.current = temp;
        topKRef.current = topK;
        inspectPosRef.current = cursorPos;
        isInferringRef.current = isInferring;
    }, [text, temp, topK, cursorPos, isInferring]);

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
                if (!window.Module._malloc) return; // wait for runtime
                const response = await fetch('/granty29/2026/bytegpt/rawmodel.bin');
                const buffer = await response.arrayBuffer();
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
        
        const loop = () => {
            if (!active) return;
            
            const state = engineRef.current;
            const targetText = textRef.current;
            
            let changed = false;
            
            if (state.text !== targetText) {
                let diffIdx = 0;
                while (diffIdx < targetText.length && diffIdx < state.text.length && targetText[diffIdx] === state.text[diffIdx]) {
                    diffIdx++;
                }
                
                if (diffIdx < state.text.length) {
                    if (Date.now() - state.lastTypeTime < 300) {
                        requestAnimationFrame(loop);
                        return; 
                    }
                    state.text = state.text.substring(0, diffIdx);
                    state.probs = state.probs.slice(0, diffIdx);
                    
                    if (diffIdx > 0) {
                        window.Module.ccall('seek', 'number', ['number'], [diffIdx - 1]);
                        window.Module.ccall('predict_next', 'number', ['number'], [targetText.charCodeAt(diffIdx - 1) & 255]);
                    } else {
                        window.Module.ccall('seek', 'number', ['number'], [0]);
                    }
                    state.engineCursor = diffIdx;
                    
                    state.totalNLL = 0;
                    for(let i = 0; i < state.probs.length; i++) {
                        if (state.probs[i] > 0) state.totalNLL -= Math.log(state.probs[i]);
                    }
                    changed = true;
                }
                
                let charsProcessed = 0;
                while (state.text.length < targetText.length && charsProcessed < 5) {
                    if (state.engineCursor !== state.text.length) {
                        if (state.text.length > 0) {
                            window.Module.ccall('seek', 'number', ['number'], [state.text.length - 1]);
                            window.Module.ccall('predict_next', 'number', ['number'], [targetText.charCodeAt(state.text.length - 1) & 255]);
                        } else {
                            window.Module.ccall('seek', 'number', ['number'], [0]);
                        }
                        state.engineCursor = state.text.length;
                    }
                    
                    let nextByte = targetText.charCodeAt(state.text.length) & 255;
                    let prob = 1.0;
                    
                    if (state.text.length > 0) {
                        let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                        let logits = new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256);
                        
                        let maxLogit = -Infinity;
                        for(let i=0; i<256; i++) if(logits[i] > maxLogit) maxLogit = logits[i];
                        let sum = 0;
                        let t = tempRef.current || 1.0;
                        for(let i=0; i<256; i++) sum += Math.exp((logits[i] - maxLogit) / t);
                        prob = Math.exp((logits[nextByte] - maxLogit) / t) / sum;
                    }
                    
                    state.probs.push(prob);
                    if (prob > 0) state.totalNLL -= Math.log(prob);
                    
                    window.Module.ccall('predict_next', 'number', ['number'], [nextByte]);
                    state.engineCursor++;
                    state.text += targetText[state.text.length];
                    state.tokCount++;
                    
                    charsProcessed++;
                    changed = true;
                }
            } else if (isInferringRef.current && targetText.length < 4096) {
                if (state.engineCursor !== state.text.length) {
                    if (state.text.length > 0) {
                        window.Module.ccall('seek', 'number', ['number'], [state.text.length - 1]);
                        window.Module.ccall('predict_next', 'number', ['number'], [targetText.charCodeAt(state.text.length - 1) & 255]);
                    } else {
                        window.Module.ccall('seek', 'number', ['number'], [0]);
                    }
                    state.engineCursor = state.text.length;
                }
                
                let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                let logits = new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256);
                
                let nextByte = sampleLogits(logits, tempRef.current, topKRef.current);
                let newChar = String.fromCharCode(nextByte);
                
                setText(t => t + newChar);
                textRef.current += newChar;
                state.lastTypeTime = Date.now();
            }
            
            if (state.text === targetText && inspectPosRef.current !== state.lastInspectPos) {
                const pos = inspectPosRef.current;
                state.lastInspectPos = pos;
                
                if (pos > 0 && pos <= state.text.length) {
                    window.Module.ccall('seek', 'number', ['number'], [pos - 1]);
                    window.Module.ccall('predict_next', 'number', ['number'], [state.text.charCodeAt(pos - 1) & 255]);
                    state.engineCursor = pos;
                    
                    let logitsPtr = window.Module.ccall('get_logits', 'number', [], []);
                    let logitsCopy = new Float32Array(new Float32Array(window.Module.HEAPF32.buffer, logitsPtr, 256));
                    
                    let statsPtr = window.Module.ccall('get_stats', 'number', [], []);
                    let statsCopy = new Float32Array(new Float32Array(window.Module.HEAPF32.buffer, statsPtr, 24 * 8 * 4096));
                    
                    setInspectData({ logits: logitsCopy, stats: statsCopy, pos });
                } else {
                    setInspectData(null);
                }
            }
            
            if (changed || state.tokCount % 10 === 0) {
                setRenderTick(t => t + 1);
                let dt = (Date.now() - state.startTime) / 1000;
                setStats({
                    tokPerSec: dt > 0 ? (state.tokCount / dt) : 0,
                    perplexity: state.probs.length > 0 ? Math.exp(state.totalNLL / state.probs.length) : 0
                });
            }
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
        return () => { active = false; };
    }, [ready]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            setLayer(l => Math.min(23, l + 1));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
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

    const [hoveredAttn, setHoveredAttn] = useState(null);

    const renderAttentionText = (pos, stats, layer, head, textVal, isRaw) => {
        if (!stats || pos <= 0) return null;
        let offset = layer * 8 * 4096 + head * 4096;
        
        let textUpto = textVal.substring(0, pos);
        let rawDots = new Float32Array(pos);
        let maxRaw = -Infinity;
        for (let i = 0; i < pos; i++) {
            rawDots[i] = stats[offset + i];
            if (rawDots[i] > maxRaw) maxRaw = rawDots[i];
        }
        
        let probs = new Float32Array(pos);
        let sum = 0;
        for (let i = 0; i < pos; i++) {
            probs[i] = Math.exp(rawDots[i] - maxRaw);
            sum += probs[i];
        }
        let maxProb = 0;
        for (let i = 0; i < pos; i++) {
            probs[i] /= sum;
            if (probs[i] > maxProb) maxProb = probs[i];
        }
        
        return textUpto.split('').map((c, i) => {
            let val = isRaw ? rawDots[i] : probs[i];
            let titleText = isRaw ? val.toFixed(4) : (val * 100).toFixed(2) + '%';
            let norm = maxProb > 1e-6 ? probs[i] / maxProb : 0;
            let r = Math.round(255 * (1 - norm));
            let g = Math.round(255 * norm);
            return (
                <span key={i} 
                      title={titleText} 
                      style={{ color: `rgb(${r}, ${g}, 0)`, cursor: 'crosshair' }}
                      onMouseEnter={() => setHoveredAttn({ char: c, val: titleText })}
                      onMouseLeave={() => setHoveredAttn(null)}
                >
                    {c}
                </span>
            );
        });
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
                <div className="text-gray-700">Perplexity: {stats.perplexity.toFixed(2)}</div>
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
                        {text.split('').map((c, i) => (
                            <span key={i} style={{backgroundColor: getHighlightColor(engineRef.current.probs[i])}}>{c}</span>
                        ))}
                        {text.endsWith('\n') ? <br /> : null}
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
                            if (e.target.value.length > 4096) return;
                            setText(e.target.value);
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
                                <h3 className="font-bold mb-2">Logits for Next Token</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {getTopLogitsInfo(inspectData.logits, showRaw).map((x, i) => {
                                        const actualNextChar = text.charCodeAt(inspectData.pos) & 255;
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
                                    {renderAttentionText(inspectData.pos, inspectData.stats, layer, head, text, showRaw)}
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
