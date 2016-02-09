exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // seleniumServerJar: './node_modules/selenium-standalone-jar/bin/selenium-server-standalone-2.45.0.jar',
  specs: ['appFeatures.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:8100',
  jasmineNodeOpts: {
    isVerbose:true,
  }
};
