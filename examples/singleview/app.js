// 
/**
 * Using different DI than we'd do inside a webpack/babel project so it'll work 
 * inside sandbox (normally we'd use import { stuff } from 'aurelia-framework')
 */
const { EventAggregator, observable } = au;

export class App {
   /**
    * Using 'static inject' since we can't use decorators without babel
    */
   static inject = [EventAggregator];
   message = 'Message from app.js';

   constructor(eventAggregator) {

   }
}
