window.SandboxHelper = class {
    _defaultSettings = {
        aureliaPath: '/aurelia',
        auVersion: '1.5.2',
        srcPath: '',
    };
    _settings;

    constructor(settings) {
        this._settings = Object.assign({}, this._defaultSettings, settings);
    }

    get baseUrl() { return `${this.rootUrl}${this.basePath}`; }
    get commonUrl() { return `${this.rootUrl}/examples/common`; }
    get basePath() { return window.location.pathname; }
    get rootUrl() { return window.location.origin; }

    /**
     * aurelia script URL generator
     * @param {*} withRouter 
     * @param {*} minify 
     * @returns string of path to aurelia script
     */
    auScriptUrl(withRouter, minify = true) {
        const auFileName = `aurelia${withRouter ? '_router' : ''}.umd${minify ? '.min' : ''}`;
        
        return `${this.rootUrl}${this._settings.aureliaPath}/${this._settings.auVersion}/${auFileName}.js`;
    }

    buildPath(file = '') {
        return `${this.basePath}${this._settings.srcPath}/${file}`;
    }

    nastyCodesandboxHack(auObject) {
        /**
         * Nasty hack to fix issue with codesandbox.io auto injecting JS scripts into .html view files
         */
         auObject.DOM.createTemplateFromMarkup = function (markup) {
            let parser = document.createElement("div");
            parser.innerHTML = markup;
            const tmpl = parser.getElementsByTagName("template")[0] || false;
          
            return tmpl;
          };
    }

    loadScriptFirst(scriptUrl) {
        const script = document.createElement('script');
        script.src = scriptUrl;

        document.body.appendChild(script);
        
        return new Promise((res, rej) => {
          script.onload = ()=>res();
          script.onerror = ()=>rej();
        });
      }
}
