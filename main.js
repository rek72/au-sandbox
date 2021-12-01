window.sandboxHelper = {
  srcPath: (file = '') => `/src/${file}`
}; 

//TODO: Nasty hack to fix issue with codesandbox.io auto injecting JS scripts into .html view files
au.DOM.createTemplateFromMarkup = function (markup) {
  let parser = document.createElement("div");
  parser.innerHTML = markup;
  const tmpl = parser.getElementsByTagName("template")[0] || false;

  return tmpl;
};

const aurelia = new au.Aurelia();

aurelia.use.standardConfiguration().developmentLogging();

aurelia
  .start()
  .then(() => aurelia.setRoot(window.sandboxHelper.srcPath('app.js'), window.document.body));
