import { OneyContext } from '@oney/context';
import { GlobalContextProvider, GlobalContextProviderErrors } from './GlobalContextProvider';

describe('GlobalContextProvider', () => {
  const expect_GLOBAL_CONTEXT_NOT_AVAILABLE = result => {
    const expected = GlobalContextProviderErrors.GLOBAL_CONTEXT_NOT_AVAILABLE;

    if (result.success) {
      fail('it should not be in success');
    } else {
      expect(result.reason).toBe(expected);
    }
  };

  it('should not available without run', () => {
    const result = GlobalContextProvider.available;

    expect(result).toBe(false);
  });

  it('should be available with run', () => {
    GlobalContextProvider.run(() => {
      const result = GlobalContextProvider.available;
      expect(result).toBe(true);
    });
  });

  it('get context should return GLOBAL_CONTEXT_NOT_AVAILABLE', () => {
    const result = GlobalContextProvider.get();
    expect_GLOBAL_CONTEXT_NOT_AVAILABLE(result);
  });

  it('get metadata should return GLOBAL_CONTEXT_NOT_AVAILABLE', () => {
    const result = GlobalContextProvider.getMetadata('something');
    expect_GLOBAL_CONTEXT_NOT_AVAILABLE(result);
  });

  it('set context should return GLOBAL_CONTEXT_NOT_AVAILABLE', () => {
    const result = GlobalContextProvider.set({});
    expect_GLOBAL_CONTEXT_NOT_AVAILABLE(result);
  });

  it('set metadata should return GLOBAL_CONTEXT_NOT_AVAILABLE', () => {
    const result = GlobalContextProvider.setMetadata('something', {});
    expect_GLOBAL_CONTEXT_NOT_AVAILABLE(result);
  });

  it('when available should get / set context', () => {
    GlobalContextProvider.run(() => {
      const expected: OneyContext = {
        initiator: 'initiator',
        actorId: 'actorId',
        correlationId: 'actorId',
      };

      const setResult = GlobalContextProvider.set(expected);
      expect(setResult.success).toBe(true);

      const getResult = GlobalContextProvider.get();
      expect(getResult.success).toBe(true);

      if (getResult.success) {
        expect(getResult.value).toBe(expected);
      }
    });
  });

  it('when available should get / set metadata', () => {
    const key = 'something';
    const expected = 'nothing';

    GlobalContextProvider.run(() => {
      const setResult = GlobalContextProvider.setMetadata(key, expected);
      expect(setResult.success).toBe(true);

      const getResult = GlobalContextProvider.getMetadata(key);
      expect(getResult.success).toBe(true);

      if (getResult.success) {
        expect(getResult.value).toBe(expected);
      }
    });

    const getResult = GlobalContextProvider.getMetadata(key);
    expect(getResult.success).toBe(false);
  });

  it('when available should get / set metadata, with good scope', () => {
    const key = 'something';
    const expected = 'nothing';

    GlobalContextProvider.run(() => {
      const setResult = GlobalContextProvider.setMetadata(key, expected);
      expect(setResult.success).toBe(true);

      {
        const getResult = GlobalContextProvider.getMetadata(key);
        expect(getResult.success).toBe(true);

        if (getResult.success) {
          expect(getResult.value).toBe(expected);
        }
      }

      GlobalContextProvider.run(() => {
        const expected = 'autrechose';
        const setResult = GlobalContextProvider.setMetadata(key, expected);
        expect(setResult.success).toBe(true);

        const getResult = GlobalContextProvider.getMetadata(key);
        expect(getResult.success).toBe(true);

        if (getResult.success) {
          expect(getResult.value).toBe(expected);
        }
      });

      {
        const getResult = GlobalContextProvider.getMetadata(key);
        expect(getResult.success).toBe(true);

        if (getResult.success) {
          expect(getResult.value).toBe(expected);
        }
      }
    });

    const getResult = GlobalContextProvider.getMetadata(key);
    expect(getResult.success).toBe(false);
  });
});
