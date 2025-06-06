let fs = require('fs')

if (!fs.existsSync(`./package/dist`)) {
   fs.mkdirSync(`./package/dist`, 744)
}

fs.readdirSync(`./builds`).forEach((file) => {
   bundleFile(file)
})

fs.copyFile('./package/src/types.d.ts', './package/dist/types.d.ts', (err) => {
   if (err) {
      throw err
   }
})

function bundleFile(file) {
   // Based on the filename, give esbuild a specific configuration to build.
   ;({
      // This output file is meant to be loaded in a browser's <script> tag.
      'cdn.js': () => {
         build({
            entryPoints: [`./builds/${file}`],
            outfile: `./package/dist/${file}`,
            bundle: true,
            platform: 'browser',
            define: { CDN: 'true' },
         })

         // Build a minified version.
         build({
            entryPoints: [`./builds/${file}`],
            outfile: `./package/dist/${file.replace('.js', '.min.js')}`,
            bundle: true,
            minify: true,
            platform: 'browser',
            define: { CDN: 'true' },
         })
      },
      // This file outputs two files: an esm module and a cjs module.
      // The ESM one is meant for "import" statements (bundlers and new browsers)
      // and the cjs one is meant for "require" statements (node).
      'module.js': () => {
         build({
            entryPoints: [`./builds/${file}`],
            outfile: `./package/dist/${file.replace('.js', '.esm.js')}`,
            bundle: true,
            platform: 'neutral',
            mainFields: ['module', 'main'],
         })

         build({
            entryPoints: [`./builds/${file}`],
            outfile: `./package/dist/${file.replace('.js', '.cjs.js')}`,
            bundle: true,
            target: ['node10.4'],
            platform: 'node',
         })
      },
   })[file]()
}

function build(options) {
   const devMode = process.argv.includes('--watch')

   options.define || (options.define = {})

   options.define['process.env.NODE_ENV'] = devMode
      ? `'production'`
      : `'development'`

   return require('esbuild')
      .build({
         logLevel: devMode ? 'info' : 'warning',
         plugins: devMode ? [watchPlugin()] : [],
         ...options,
      })
      .catch(() => process.exit(1))
}

function watchPlugin() {
   return {
      name: 'watch-plugin',
      setup() {},
   }
}
