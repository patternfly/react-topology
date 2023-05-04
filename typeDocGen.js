const TypeDoc = require("typedoc");
const path = require('path');

async function typeDocGen(entryPoint, tsconfigLocation) {
  const app = new TypeDoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
      // typedoc options here
      entryPointStrategy: 'expand',
      entryPoints: [entryPoint],
      tsconfig: tsconfigLocation
  });

  const project = app.convert();

  if (project) {
      // Project may not have converted correctly
      const outputDir = "docs";

      // Rendered docs
      await app.generateDocs(project, outputDir);
      // Alternatively generate JSON output
      // await app.generateJson(project, outputDir + "/documentation.json");
  }
}

const packageBase = './packages/module'
const entry = path.relative(process.cwd(), path.join(packageBase, 'src'))
const configLocation = path.relative(process.cwd(), path.join(packageBase, 'tsconfig.json'))

// eslint-disable-next-line no-console
typeDocGen(entry, configLocation).catch(console.error);

