exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['appFeatures.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:8100',
  jasmineNodeOpts: {
    isVerbose:true,
  }
};
