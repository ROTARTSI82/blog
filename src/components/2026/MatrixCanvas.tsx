import React, { useRef, useEffect, useState } from 'react';

export default function MatrixCanvas({ 
    activeMatrix,
    onHoverPt
}) {
    const canvasRef = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(2);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setOffset({ x: 0, y: 0 });
        setScale(2);
    }, [activeMatrix]);

    useEffect(() => {
        if (!activeMatrix || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        const { data, rows, cols, maxAbs } = activeMatrix;
        
        const imageData = ctx.createImageData(width, height);
        const imgPixels = imageData.data;
        const normFactor = 255 / (maxAbs + 1e-6);
        
        const colMapping = new Int32Array(width);
        for (let px = 0; px < width; px++) {
            colMapping[px] = Math.floor((px - offset.x) / scale);
        }
        
        for (let py = 0; py < height; py++) {
            const r = Math.floor((py - offset.y) / scale);
            if (r < 0 || r >= rows) continue;
            
            const rowOffset = r * cols;
            let destIdx = py * width * 4;
            
            for (let px = 0; px < width; px++) {
                const c = colMapping[px];
                if (c >= 0 && c < cols) {
                    const val = data[rowOffset + c];
                    
                    if (val < 0) {
                        imgPixels[destIdx + 2] = -val * normFactor; // blue
                    } else if (val > 0) {
                        imgPixels[destIdx + 1] = val * normFactor; // green
                    }
                    imgPixels[destIdx + 3] = 255; // alpha
                }
                destIdx += 4;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }, [activeMatrix, offset, scale]);

    const getMouseCoords = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { mx: 0, my: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            mx: (e.clientX - rect.left) * scaleX,
            my: (e.clientY - rect.top) * scaleY
        };
    };

    const stateRef = useRef({ offset, scale });
    useEffect(() => {
        stateRef.current = { offset, scale };
    }, [offset, scale]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const handleWheelNative = (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            const zoom = e.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
            
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;
            
            const { offset: prevOffset, scale: prevScale } = stateRef.current;
            
            const px = (mx - prevOffset.x) / prevScale;
            const py = (my - prevOffset.y) / prevScale;
            
            const newScale = Math.max(0.1, Math.min(150, prevScale * zoom));
            
            setOffset({
                x: mx - px * newScale,
                y: my - py * newScale
            });
            setScale(newScale);
        };

        canvas.addEventListener('wheel', handleWheelNative, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheelNative);
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const { mx, my } = getMouseCoords(e);
        setDragStart({ x: mx - offset.x, y: my - offset.y });
    };

    const handleMouseMove = (e) => {
        const { mx, my } = getMouseCoords(e);

        if (isDragging) {
            setOffset({
                x: mx - dragStart.x,
                y: my - dragStart.y
            });
        }
        
        if (onHoverPt && activeMatrix) {
            const c = Math.floor((mx - offset.x) / scale);
            const r = Math.floor((my - offset.y) / scale);
            
            if (r >= 0 && r < activeMatrix.rows && c >= 0 && c < activeMatrix.cols) {
                onHoverPt({ r, c, val: activeMatrix.data[r * activeMatrix.cols + c] });
            } else {
                onHoverPt(null);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <canvas 
            ref={canvasRef}
            width={800}
            height={500}
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); if (onHoverPt) onHoverPt(null); }}
        />
    );
}
