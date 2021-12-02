import { BaseViewModel } from './base-view-model.js';

export class Index extends BaseViewModel {
  counter = 0;
  model = {
    param1: 'one',
    param2: 'two'
  };

  otherModel = {
    nestedProperty: 'test'
  };
  
  attached() {
    this.allPropertiesObserver('model');
    this.propertyObserver('otherModel', 'nestedProperty');
  }

  changeModel() {
    this.model.param1 = Date.now();
  }

  changeOtherModel() {
    this.counter++;
    const smartComment = (this.counter > 3) ? '<span style="color: red">Easy there Mr. Click Happy!  ;)</span>' : '';
    this.otherModel.nestedProperty = `nestedProperty has changed ${this.counter} times. ${smartComment}`;
  }

  modelParam1Changed(newVal, oldVal) {
   alert(`this.model.param1 Changed Event: newVal: ${newVal}, oldVal: ${oldVal}`);
  }
}
