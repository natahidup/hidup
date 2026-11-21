import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emitTokensCss } from '../src/css.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'tokens.css')
writeFileSync(target, emitTokensCss(), 'utf8')
console.log(`Wrote ${target}`)
