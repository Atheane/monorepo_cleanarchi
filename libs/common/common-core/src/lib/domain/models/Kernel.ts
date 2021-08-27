export interface Kernel {
  initDependencies(useInMemory: boolean): Promise<Kernel>;
}
