window.sandboxHelper = new window.SandboxHelper({ srcPath: '/src' });

const auScriptUrl = window.sandboxHelper.auScriptUrl(false);

/**
 * We need to load aurelia lib first and THEN do stuff with the aurelia window object it created (window.au)
 * You could this method in a prod app but whatever DI you use, you need to make sure aurelia is loaded first
 */
window.sandboxHelper.loadScriptFirst(auScriptUrl)
  .then(() => {

    actualAureliaBootstrapingCode();
  });


function actualAureliaBootstrapingCode() {
  const aurelia = new au.Aurelia();

  window.sandboxHelper.nastyCodesandboxHack(au);

  aurelia.use.standardConfiguration().developmentLogging();

  aurelia
    .start()
    .then(() => aurelia.setRoot(window.sandboxHelper.buildPath('app.js'), window.document.body));
}
