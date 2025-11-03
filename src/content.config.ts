import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    loader: glob({base: './src/markdown', pattern: '**/*.{md,mdx}'}),
    schema: _ => z.object({
        title: z.string(),
        author: z.string().optional(),
        location: z.string().optional(),
        created: z.coerce.date(),
        modified: z.coerce.date().optional(),
        subhead: z.string().optional(),
        tags: z.string().optional(),
    })
});

export const collections = { blog };
