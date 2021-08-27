/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { TagRepositoryRead } from '@oney/payment-core';
import { OdbP2PRepositoryRead } from '../adapters/repositories/odb/OdbP2PRepositoryRead';

describe('Test suite for tag building', () => {
  let odbP2PRepository: TagRepositoryRead;

  beforeAll(async () => {
    odbP2PRepository = new OdbP2PRepositoryRead();
  });

  it('Each tagType should have a correct lenght', async () => {
    const tag = await odbP2PRepository.getByRef(1);
    const buildTag = tag.buildTag();
    const splitBuildTag = buildTag.split('-');
    expect(splitBuildTag[0].length).toEqual(1);
    expect(splitBuildTag[1].length).toEqual(18);
    expect(splitBuildTag[2].length).toEqual(5);
    expect(splitBuildTag[3].length).toEqual(3);
  });

  it('Each tagType should have its correct position', async () => {
    const tag = await odbP2PRepository.getByRef(36, 'azz');
    const buildTag = tag.buildTag();
    const getPosition = (startIndex: number, endIndex: number) =>
      buildTag
        .split('')
        .map((item, index) => {
          if (index >= startIndex && index <= endIndex) {
            return item;
          }
          return null;
        })
        .join('');
    expect(getPosition(0, 0)).toEqual(tag.setWhiteSpace(tag.outstandingCode, 1));
    expect(getPosition(2, 19)).toEqual(tag.setWhiteSpace(tag.operationCodeType, 18));
    expect(getPosition(21, 25)).toEqual(tag.setWhiteSpace(tag.productCode, 5));
    expect(getPosition(27, 29)).toEqual(tag.setWhiteSpace(tag.countryCode, 3));
    expect(getPosition(31, 33)).toEqual(tag.setWhiteSpace(tag.subscriptionMonthlyNumber, 3));
  });
});
