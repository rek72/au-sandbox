const { bindable } = au; // using different DI than we'd do inside a webpack/babel project so it'll work inside sanbox

export class Test {
  @bindable tester;
}
