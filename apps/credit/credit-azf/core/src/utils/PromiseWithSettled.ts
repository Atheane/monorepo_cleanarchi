export enum PromiseStatus {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export class PromiseWithSettled {
  static allSettled(
    promises: Promise<any>[],
  ): Promise<Array<{ status: PromiseStatus; value?: any; reason?: any }>> {
    const mappedPromises = promises.map(p =>
      p
        .then(value => ({
          status: PromiseStatus.FULFILLED,
          value,
        }))
        .catch(reason => ({
          status: PromiseStatus.REJECTED,
          reason,
        })),
    );
    return Promise.all(mappedPromises);
  }
}
