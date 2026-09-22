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
        
        ctx.clearRect(0, 0, width, height);
        
        const { data, rows, cols, maxAbs } = activeMatrix;
        
        const cellW = scale;
        const cellH = scale;
        
        const startC = Math.max(0, Math.floor(-offset.x / cellW));
        const startR = Math.max(0, Math.floor(-offset.y / cellH));
        const endC = Math.min(cols, Math.ceil((width - offset.x) / cellW));
        const endR = Math.min(rows, Math.ceil((height - offset.y) / cellH));
        
        if (endC <= startC || endR <= startR) return;
        
        // for better performance, could use ImageData, but fillRect is usually fine for these sizes
        for (let r = startR; r < endR; r++) {
            for (let c = startC; c < endC; c++) {
                const val = data[r * cols + c];
                const norm = val / (maxAbs + 1e-6);
                if (val < 0) {
                    ctx.fillStyle = `rgb(0, 0, ${Math.floor(-norm * 255)})`;
                } else {
                    ctx.fillStyle = `rgb(0, ${Math.floor(norm * 255)}, 0)`;
                }
                ctx.fillRect(offset.x + c * cellW, offset.y + r * cellH, cellW, cellH);
            }
        }
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

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const zoom = e.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
        
        const { mx, my } = getMouseCoords(e);
        
        const px = (mx - offset.x) / scale;
        const py = (my - offset.y) / scale;
        
        const newScale = Math.max(0.1, Math.min(150, scale * zoom));
        
        setOffset({
            x: mx - px * newScale,
            y: my - py * newScale
        });
        setScale(newScale);
    };

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
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); if (onHoverPt) onHoverPt(null); }}
        />
    );
}
