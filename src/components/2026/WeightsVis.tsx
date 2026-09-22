import React, { useEffect, useState, useRef, useMemo } from 'react';
import byteFreqsData from './byteFreqs.json';
import MatrixCanvas from './MatrixCanvas';
import { getTensors, formatByteName, quantile } from './weightsUtils';

const byteFreqs = byteFreqsData as Record<string, number>;
const TENSORS = getTensors();
const TENSOR_NAMES = Object.keys(TENSORS);

export default function WeightsVis({ modelUrl }: { modelUrl: string }) {
    const [ready, setReady] = useState(false);
    const [weights, setWeights] = useState<Float32Array | null>(null);
    const [tensorName, setTensorName] = useState('tok_embed');
    const [threshold, setThreshold] = useState(0);
    const [hoverPt, setHoverPt] = useState<{ r: number, c: number, val: number } | null>(null);
    const [activeMatrix, setActiveMatrix] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const resp = await fetch(modelUrl);
            const buf = await resp.arrayBuffer();
            setWeights(new Float32Array(buf));
            setReady(true);
        };
        load();
    }, [modelUrl]);

    useEffect(() => {
        if (!ready || !weights) return;
        
        const info = TENSORS[tensorName];
        let raw: Float32Array | null = null;
        let rows = info.shape[0];
        let cols = info.shape.length > 1 ? info.shape[1] : 1;
        
        if (info.type === 'embed_corr_row' || info.type === 'embed_corr_col') {
            const baseInfo = TENSORS[info.src];
            const base = weights.subarray(baseInfo.offset, baseInfo.offset + 256 * 256);
            raw = new Float32Array(256 * 256);
            if (info.type === 'embed_corr_row') {
                for (let i = 0; i < 256; i++) {
                    for (let j = 0; j < 256; j++) {
                        let sum = 0;
                        for (let k = 0; k < 256; k++) sum += base[i * 256 + k] * base[j * 256 + k];
                        raw[i * 256 + j] = sum;
                    }
                }
            } else {
                for (let i = 0; i < 256; i++) {
                    for (let j = 0; j < 256; j++) {
                        let sum = 0;
                        for (let k = 0; k < 256; k++) sum += base[k * 256 + i] * base[k * 256 + j];
                        raw[i * 256 + j] = sum;
                    }
                }
            }
        } else {
            const length = rows * cols;
            raw = weights.subarray(info.offset, info.offset + length);
        }

        let validRows: number[] = [];
        let validCols: number[] = [];
        
        const appliesThreshold = tensorName.startsWith('tok_embed');
        for (let i = 0; i < rows; i++) {
            if (appliesThreshold && info.type !== 'embed_corr_col') {
                if (byteFreqs[i.toString()] >= threshold) validRows.push(i);
            } else {
                validRows.push(i);
            }
        }
        
        for (let j = 0; j < cols; j++) {
            if (appliesThreshold && (info.type === 'embed_corr_row' || info.type === 'embed_corr_col')) {
                if (byteFreqs[j.toString()] >= threshold) validCols.push(j);
            } else {
                validCols.push(j);
            }
        }

        const filteredRows = validRows.length;
        const filteredCols = validCols.length;
        const filteredData = new Float32Array(filteredRows * filteredCols);
        
        let filteredIdx = 0;
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;
        
        for (let r = 0; r < filteredRows; r++) {
            for (let c = 0; c < filteredCols; c++) {
                const origRow = validRows[r];
                const origCol = validCols[c];
                const val = raw[origRow * cols + origCol];
                filteredData[filteredIdx++] = val;
                sum += val;
                if (val < min) min = val;
                if (val > max) max = val;
            }
        }

        const mean = sum / (filteredRows * filteredCols);
        let sqSum = 0;
        for (let i = 0; i < filteredData.length; i++) {
            sqSum += (filteredData[i] - mean) ** 2;
        }
        const stddev = Math.sqrt(sqSum / filteredData.length);
        
        const sorted = new Float32Array(filteredData);
        sorted.sort();
        const q25 = quantile(sorted, 0.25);
        const median = quantile(sorted, 0.5);
        const q75 = quantile(sorted, 0.75);
        
        setStats({
            mean, stddev, min, max, median, q25, q75,
            n: filteredData.length
        });
        
        setActiveMatrix({ 
            data: filteredData, 
            rows: filteredRows, 
            cols: filteredCols, 
            validRows, 
            validCols, 
            maxAbs: Math.max(Math.abs(min), Math.abs(max)) 
        });
        
    }, [ready, weights, tensorName, threshold]);

    if (!ready) {
        return <div className="p-4 text-center border rounded bg-gray-50 text-gray-700">Downloading Model Weights... (~82MB)</div>;
    }

    return (
        <div className="flex flex-col gap-4 border border-gray-300 rounded bg-white text-black text-sm p-4">
            <div className="flex gap-4 items-center">
                <select 
                    value={tensorName} 
                    onChange={e => setTensorName(e.target.value)}
                    className="border p-1 rounded"
                >
                    {TENSOR_NAMES.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                
                {tensorName.startsWith('tok_embed') && (
                    <div className="flex items-center gap-2">
                        <label title="Filter out bytes that occur in less than X% of the dataset">Min Frequency Threshold:</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="0.05" 
                            step="0.0001" 
                            value={threshold} 
                            onChange={e => setThreshold(parseFloat(e.target.value))} 
                        />
                        <span>{(threshold * 100).toFixed(2)}%</span>
                    </div>
                )}
            </div>
            
            {stats && (
                <div className="flex flex-wrap gap-4 text-xs bg-gray-100 p-2 rounded">
                    <div><b>n:</b> {stats.n}</div>
                    <div><b>μ:</b> {stats.mean.toFixed(6)}</div>
                    <div><b>σ:</b> {stats.stddev.toFixed(6)}</div>
                    <div><b>[min, q25, med, q75, max]:</b> [{stats.min.toFixed(4)}, {stats.q25.toFixed(4)}, {stats.median.toFixed(4)}, {stats.q75.toFixed(4)}, {stats.max.toFixed(4)}]</div>
                </div>
            )}
            
            <div className="relative w-full h-[500px] border bg-gray-900 overflow-hidden cursor-crosshair group">
                <MatrixCanvas activeMatrix={activeMatrix} onHoverPt={setHoverPt} />
                
                {hoverPt && activeMatrix && (
                    <div className="absolute bottom-2 left-2 bg-black text-white p-2 text-xs rounded opacity-90 pointer-events-none z-10 hidden group-hover:block">
                        <div><b>Val:</b> {hoverPt.val.toFixed(6)}</div>
                        <div>
                            <b>Row:</b> {activeMatrix.validRows[hoverPt.r]} 
                            {tensorName.startsWith('tok_embed') && !tensorName.endsWith('col_corr') && ` (${formatByteName(activeMatrix.validRows[hoverPt.r])})`}
                        </div>
                        <div>
                            <b>Col:</b> {activeMatrix.validCols[hoverPt.c]}
                            {tensorName.startsWith('tok_embed') && (tensorName === 'tok_embed.row_corr' || tensorName === 'tok_embed.col_corr') && tensorName === 'tok_embed.row_corr' && ` (${formatByteName(activeMatrix.validCols[hoverPt.c])})`}
                        </div>
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-500 text-center">
                Scroll to zoom, click and drag to pan. Blue = Negative, Green = Positive.
            </div>
        </div>
    );
}
