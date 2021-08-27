export enum RuntimeEnvironement {
  production = 'production',
  test = 'test',
  development = 'development',
}
export type RuntimeEnvironements = keyof typeof RuntimeEnvironement;

/**
 * Prevent instances from inherited classes.
 * @param target Target.
 */
export function final<T extends { new (...args: any[]): object }>(target: T): T {
  return class Final extends target {
    constructor(...args: any[]) {
      // because: no added value to test this
      /* istanbul ignore if */
      if (new.target !== Final) {
        throw new Error('Cannot inherit from final class');
      }
      super(...args);
    }
  };
}

/**
 * Freeze constructor and prototype.
 * @param target Target.
 */
export function frozen(target: Function): void {
  const runtime = process.env.NODE_ENV as RuntimeEnvironements;

  // because: not executed during tests because will make it impossible to mock functions because locked
  /* istanbul ignore if */
  if (runtime !== RuntimeEnvironement.test) {
    Object.freeze(target);
    Object.freeze(target.prototype);
  }
}
