const { join, basename, resolve, relative } = require('path');
const { outputFileSync, copyFileSync, copySync } = require('fs-extra');
const { generateClassMaps } = require('./generateClassMaps');
const {ensureDirSync} = require("fs-extra/lib/mkdirs");

const outDir = resolve(__dirname, '../src/css');
const distDir = resolve(__dirname, '../dist/esm/css');

const writeCJSExport = (file, classMap) =>
  outputFileSync(
    join(outDir, file.replace(/.css$/, '.js')),
    `
"use strict";
exports.__esModule = true;
require('./${basename(file, '.css.js')}');
exports.default = ${JSON.stringify(classMap, null, 2)};
`.trim()
  );

const writeESMExport = (file, classMap) =>
  outputFileSync(
    join(outDir, file.replace(/.css$/, '.mjs')),
    `
import './${basename(file, '.css.js')}';
export default ${JSON.stringify(classMap, null, 2)};
`.trim()
  );

const writeDTSExport = (file, classMap) =>
  outputFileSync(
    join(outDir, file.replace(/.css$/, '.d.ts')),
    `
import './${basename(file, '.css.js')}';
declare const _default: ${JSON.stringify(classMap, null, 2)};
export default _default;
`.trim()
  );

/**
 * @param {any} classMaps Map of file names to classMaps
 */
function writeClassMaps(classMaps) {
  Object.entries(classMaps).forEach(([file, classMap]) => {
    const outPath = relative('src/css', file);

    writeCJSExport(outPath, classMap);
    writeDTSExport(outPath, classMap);
    writeESMExport(outPath, classMap);
    copyFileSync(file, join(outDir, outPath));

    ensureDirSync(distDir);
    copySync(outDir, distDir);
  });

  // eslint-disable-next-line no-console
  console.log('Wrote', Object.keys(classMaps).length * 3, 'CSS-in-JS files');
}

writeClassMaps(generateClassMaps());
