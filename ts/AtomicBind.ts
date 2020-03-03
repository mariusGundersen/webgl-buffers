import { Bindable } from './types';
export class AtomicBind {
  private currentBind: Bindable | undefined = undefined;
  bind(bindable: Bindable) {
    return () => {
      if (this.currentBind === bindable) return;

      this.currentBind = bindable;
      bindable._bind();
    }
  }
}
