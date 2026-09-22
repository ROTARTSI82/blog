export const getTensors = () => {
    let offset = 0;
    const tensors: Record<string, any> = {};
    
    tensors['tok_embed'] = { offset, shape: [256, 256], type: 'embed' };
    tensors['tok_embed.row_corr'] = { offset: 0, shape: [256, 256], type: 'embed_corr_row', src: 'tok_embed' };
    tensors['tok_embed.col_corr'] = { offset: 0, shape: [256, 256], type: 'embed_corr_col', src: 'tok_embed' };
    
    offset += 256 * 256;
    
    for (let i = 0; i < 24; i++) {
        tensors[`layer.${i}.attn_norm`] = { offset, shape: [256], type: 'norm' }; offset += 256;
        tensors[`layer.${i}.attn.wq`] = { offset, shape: [256, 256], type: 'attn' }; offset += 256*256;
        tensors[`layer.${i}.attn.wk`] = { offset, shape: [256, 256], type: 'attn' }; offset += 256*256;
        tensors[`layer.${i}.attn.wv`] = { offset, shape: [256, 256], type: 'attn' }; offset += 256*256;
        tensors[`layer.${i}.attn.wo`] = { offset, shape: [256, 256], type: 'attn' }; offset += 256*256;
        tensors[`layer.${i}.mlp_norm`] = { offset, shape: [256], type: 'norm' }; offset += 256;
        tensors[`layer.${i}.mlp.w1`] = { offset, shape: [768, 256], type: 'mlp' }; offset += 768*256;
        tensors[`layer.${i}.mlp.w2`] = { offset, shape: [256, 768], type: 'mlp' }; offset += 256*768;
        tensors[`layer.${i}.mlp.w3`] = { offset, shape: [768, 256], type: 'mlp' }; offset += 768*256;
    }
    tensors[`norm`] = { offset, shape: [256], type: 'norm' }; offset += 256;
    return tensors;
};

export function formatByteName(idx: number) {
    if (idx === 10) return '\\n';
    if (idx === 13) return '\\r';
    if (idx === 9) return '\\t';
    if (idx < 32 || idx > 126) return `\\x${idx.toString(16).padStart(2, '0')}`;
    return String.fromCharCode(idx);
}

export function quantile(sorted: Float32Array, q: number) {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}
