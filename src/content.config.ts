import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const noticies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticies' }),
  schema: z.object({
    titol: z.string(),
    titolEs: z.string(),
    data: z.string(),
    tag: z.string(),
    tagEs: z.string(),
    resum: z.string(),
    resumEs: z.string(),
    video: z.string().optional(),
    imatge: z.string().optional(),
  })
})

const documents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/documents' }),
  schema: z.object({
    identificador: z.string(),
    nom: z.string(),
    nomEs: z.string(),
    categoria: z.string(),
    categoriaEs: z.string(),
    mida: z.string(),
    url: z.string(),
  })
})

export const collections = { noticies, documents }