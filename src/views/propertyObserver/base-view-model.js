const { BindingEngine } = au; // Using different DI than we'd do inside a webpack/babel project so it'll work inside sandbox (normally we'd use import { stuff } from 'aurelia-framework')

export class BaseViewModel {
  /**
   * Using static inject since we can't use decorators without babel
   */
  static inject = [BindingEngine];

  _observerSubscriptions = {}; // all subscriptions that are generated will live inside this object for disposing on viewmodel unbinding

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
  }

  _changedCallbackNameGenerator(modelName, propertyName) {
    return `${modelName}${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}Changed`;
  }

  /**
   * Observe a property (e.g. value changed) within an object. Once subscription is setup to "observe", a changed 
   * event callback will be called. Default naming convention for changedEventCallbackName will take the modelName & propertyName 
   * and append 'Changed'. So propertyObserver(modelName, propertyName) will create a callback event with the name modelNamePropertyNameChanged()
   * which is called once modelName.propertyName value has changed.
   * @param {string} modelName 
   * @param {string} propertyName 
   * @param {string} [changedEventCallbackName] - provide a name if you want to override default naming convention
   */
  propertyObserver(modelName, propertyName, changedEventCallbackName/*optional*/) {
    if (!modelName || !this[modelName] || typeof this[modelName] !== 'object' || !propertyName || typeof propertyName !== 'string') return;

    if (!changedEventCallbackName) changedEventCallbackName = this._changedCallbackNameGenerator(modelName, propertyName);

    try {
      this._modelObserverSubscriptions = this.bindingEngine
        .propertyObserver(this[modelName], propertyName)
        .subscribe((newValue, oldValue) => {
          if (this[changedEventCallbackName]) this[changedEventCallbackName](newValue, oldValue);
        });
    } catch (err) {
      console.log('propertyObserverSubscription error: ', err.message);
    }
  }

  /**
   * Loop through object (on the "this") and obeservable to each child node (single level only).
   * When a change even happens on one of the nested properties it'll fire a convention 
   * based method that will pass in the new and old value.
   * For example:  You have an object named "myModel" and run the below on the consuming
   * view model with this.objectsPropertyObserverSubscription(myModel);.  This will 
   * automatically stub out methods for each property on myModel for any change event. 
   * Example naming convention: myModel.foobar change will then have a method available for 
   * change events at myModelFooBarChanged(newVal, oldVal); The naming convention is as follows...
   * [modelName][PropertyName][Changed] where the property name will be pascal cased such as 
   * myModel.fooBar would be FooBar which will then be myModelFooBarChanged();
   * 
   * @param {string} objName 
   * @returns 
   */
  allPropertiesObserver(objName) {
    if (!objName || typeof this[objName] !== 'object') return;

    Object
      .entries(this[objName])
      .forEach(([key, val]) => this.propertyObserver(objName, key));
  }

  unbindObservableSubscriptions() {
    Object
      .entries(this._observerSubscriptions)
      .forEach(([key, val]) => {
        if (this._observerSubscriptions[key].dispose) this._observerSubscriptions[key].dispose();
      });
  }
}
