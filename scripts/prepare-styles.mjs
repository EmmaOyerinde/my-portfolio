import fs from 'node:fs';
import { compileStyles } from './lib/styles.mjs';

fs.writeFileSync(new URL('../styles.css', import.meta.url), compileStyles());
console.log('Prepared one portable stylesheet from the component sources.');
