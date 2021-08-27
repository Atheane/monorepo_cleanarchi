export enum MaybeType {
  Just = 'maybe-type__just',
  Nothing = 'maybe-type__nothing',
}

export interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

export interface Nothing {
  type: typeof MaybeType.Nothing;
}

export type Maybe<T> = Just<T> | Nothing;

export const makeNothing = (): Nothing => ({
  type: MaybeType.Nothing,
});

export const makeJust = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value,
});
