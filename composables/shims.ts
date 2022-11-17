declare module "*?worker" {
  class WrappedWorker extends Worker {
    constructor();
  }
  export = WrappedWorker;
}
