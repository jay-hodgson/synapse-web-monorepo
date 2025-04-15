import { resolve } from 'path'
import { ConfigBuilder } from 'vite-config'

/**
 * Vite config to generate the ESM & CJS bundles for Synapse React Client.
 */
const config = new ConfigBuilder()
  .setIncludeReactConfig(true)
  .setIncludeLibraryConfig(true, {
    except: [
      // Include certain monorepo projects because the local versions may drift from the versions released on NPM
      '@sage-bionetworks/synapse-types',
      '@sage-bionetworks/synapse-client',
    ],
  })
  .setBuildLibEntry(resolve(__dirname, 'src/SWC.index.ts'))
  .setConfigOverrides({
    root: '.',
    build: {
      // Do not clean the output directory before building, since we build ESM/CJS and UMD separately.
      emptyOutDir: false,
    },
  })
  .build()

export default config
