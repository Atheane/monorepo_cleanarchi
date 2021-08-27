import { Context } from '@azure/functions';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import pdfNotificationHandler from '../index';

jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue({
        getContainerClient: jest.fn().mockReturnValue({
          getBlobClient: jest.fn().mockReturnValue({
            getBlockBlobClient: jest.fn().mockReturnValue({
              uploadStream: jest.fn().mockReturnValue({
                requestId: jest.fn(),
              }),
            }),
          }),
        }),
      }),
    },
  };
});

jest.mock('wkhtmltopdf');

describe('test pdf notification handler', () => {
  it('should catch exception', async () => {
    let result = {};
    const context = {
      log: () => undefined,
      done: (_, output) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        result = output;
      },
    } as Context;
    await pdfNotificationHandler(context, null);

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('should generate PDF', async () => {
    let result = {};
    const context = ({
      bindingData: { messageId: '1' },
      log: () => undefined,
      done: (_, output) => {
        result = output;
      },
    } as unknown) as Context;

    const message = {
      content: '<h1>PDF Content</h1>',
      path: 'path/to/file',
      footer: '<footer>PDF footer</footer>',
      pdfOptions: { pageSize: 'A4' },
    };
    await pdfNotificationHandler(context, message);

    expect(result).toBeTruthy();
    expect(context.res).toBeUndefined();
  });

  it('should generate PDF with footer', async () => {
    let result = {};
    const context = ({
      bindingData: { messageId: '1' },
      log: () => undefined,
      done: (_, output) => {
        result = output;
      },
    } as unknown) as Context;

    const message = {
      content: '<h1>PDF Content</h1>',
      path: 'path/to/file',
      footer: '<footer>PDF footer</footer>',
    };
    await pdfNotificationHandler(context, message);

    expect(result).toBeTruthy();
    expect(context.res).toBeUndefined();
  });

  it('should generate PDF with more options', async () => {
    let result = {};
    const context = ({
      bindingData: { messageId: '1' },
      log: () => undefined,
      done: (_, output) => {
        result = output;
      },
    } as unknown) as Context;

    const message = {
      content: '<h1>PDF Content</h1>',
      path: 'path/to/file',
      pdfOptions: { pageSize: 'A4' },
    };
    await pdfNotificationHandler(context, message);

    expect(result).toBeTruthy();
    expect(context.res).toBeUndefined();
  });
});
