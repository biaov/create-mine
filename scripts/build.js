const { createViteBuild, rewritePackage, copyAssets } = require('./hooks')

!(async () => {
  try {
    await createViteBuild()
    await rewritePackage()
    await copyAssets()
  } catch (e) {
    process.exit(1)
  }
})()
