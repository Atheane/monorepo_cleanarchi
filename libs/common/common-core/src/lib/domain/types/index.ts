export * from './ClassType';
export * from './PartialExceptFor';
export * from './Dictionary';
export * from './NonFunctionPropertyNames';
export * from './NonMethodKeys';
export * from './PartialExceptFor';
export * from './Public';
export * from './RemoveMethods';
export * from './OneKey';
export * from './PublicProperties';
export * from './enumHelpers';
export * from './ElementType';
export * from './JObject';
export * from './Currency';
export * from './CurrencySymbols';
export * from './TransactionSource';
export * from './TransactionType';
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type MakeOptional<T, K> = Omit<T, K> & Partial<T>; // works because "optional" & "required" = "required"

// type Diff<T, U> = T extends U ? never : T;
// type RequiredExceptFor<T, TOptional extends keyof T> = Pick<T, Diff<keyof T, TOptional>> & Partial<T>;
