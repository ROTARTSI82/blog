import React, { useEffect, useState } from 'react';
import ByteGPTApp from './ByteGPT';
import WeightsVis from './WeightsVis';

export default function ByteGPTContainer({ modelUrl }: { modelUrl: string }) {
    const [weightsBuffer, setWeightsBuffer] = useState<ArrayBuffer | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch(modelUrl);
                const buffer = await response.arrayBuffer();
                setWeightsBuffer(buffer);
            } catch (e) {
                console.error("Error loading model:", e);
            }
        };
        load();
    }, [modelUrl]);

    if (!weightsBuffer) {
        return (
            <div className="p-8 text-center text-gray-600 bg-gray-50 border rounded font-mono">
                Downloading ByteGPT Model Weights (~82MB)...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12">
            <ByteGPTApp weightsBuffer={weightsBuffer} />
            
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold font-mono">Weights Visualizer</h2>
                <WeightsVis weightsBuffer={weightsBuffer} />
            </div>
        </div>
    );
}
