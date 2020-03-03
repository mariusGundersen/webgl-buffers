import { AtomicBind } from "./AtomicBind";

export default abstract class AbstractBindlable {
  constructor(atomicBind: AtomicBind) {
    this.bind = atomicBind.bind(this);
  }

  abstract _bind(): void;

  bind() {
  }
}