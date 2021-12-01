// 
/**
 * Using different DI than we'd do inside a webpack/babel project so it'll work 
 * inside sandbox (normally we'd use import { stuff } from 'aurelia-framework')
 */
const { EventAggregator, observable, Container, ViewResources } = au;

export class App {
   /**
    * Using 'static inject' since we can't use decorators without babel
    */
   static inject = [EventAggregator, Container];
   localStorageNavName = 'nav';
   router;
   container;

   constructor(eventAggregator, container) {
      this.container = container;

      eventAggregator.subscribe('router:navigation:complete', (event) => {
         this.setNavLocalStorage(event.instruction.config.route)
      });

      //console.log('observable', observable);

      const resources = container.get(ViewResources);

      resources.registerViewEngineHooks({
         // beforeCompile: (view, s, f) => {
         //    console.log('compile view', view);
         //    console.log('s', s);
         //    console.log('f', f);
         // },
         beforeCreate: (view, s, f) => {
            // console.log('create view', view.template.innerHTML);
            // console.log('s', s);
            console.log('f', f.cloneNode(true));
         },
         // beforeBind: (view, s, f) => {
         //    console.log('bind view', view);
         //    console.log('s', s);
         //    console.log('f', f);
         // }
     });
   }

   configureRouter(config, router) {
      config.map([
         { route: ['', 'home'], name: 'home', moduleId: window.sandboxHelper.srcPath('views/home.js'), title: 'Home', nav: true },
         { route: 'playground', name: 'playground', moduleId: window.sandboxHelper.srcPath('views/playground.js'), title: 'Playground', nav: true },
         { route: 'propertyobserver', name: 'propertyobserver', moduleId: window.sandboxHelper.srcPath('views/propertyObserver/index.js'), title: 'Property Observer', nav: true }
      ]);

      this.router = router;
   }

   attached() {
      /**
       * The below just helps reload last page viewed so when developing and changing code, site will reload on last viewed page so you don't have to navigate to it
       */
      const lastNav = this.getNavLocalStorage();

      if (lastNav) this.router.navigateToRoute(lastNav);
   }

   setNavLocalStorage(routeName) {
      window.localStorage.setItem(this.localStorageNavName, routeName);
   }

   getNavLocalStorage() {
      return window.localStorage.getItem(this.localStorageNavName);
   }
}
