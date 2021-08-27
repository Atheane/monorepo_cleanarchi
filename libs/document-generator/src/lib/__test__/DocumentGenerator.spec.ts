import * as nock from 'nock';
import * as fs from 'fs';
import * as path from 'path';
import {
  PROFILE,
  SETTINGS_BODY,
  SETTINGS_BODY_FOOTER,
  SETTINGS_BODY_FOOTER_OPTION,
  PATH,
  BLOB_STORAGE_CONTAINER_NAME,
  BLOB_STORAGE_CS,
} from './fixture/contract';
import { config } from './fixture/config';
import { DocumentGenerator } from '../service/DocumentGenerator';
import { Error } from '../type/Error';

jest.mock('@azure/storage-blob', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        getBlobClient: jest.fn().mockReturnValue({
          getBlockBlobClient: jest.fn().mockReturnValue({
            uploadData: jest.fn().mockReturnValue({
              BlobUploadCommonResponse: jest.fn(),
            }),
          }),
        }),
      }),
    }),
  },
}));

describe('Test suite for documentGenerator ', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  it('should return a pdf, argument provided body', async () => {
    const file = path.resolve(__dirname, 'fixture/pdfSimple.pdf');

    nock('https://odb-docgen-functions-w.azurewebsites.net')
      .persist()
      .post('/api/ExportPdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '73609',
        eTag: '123',
      });

    const result = await new DocumentGenerator(config.documentGeneratorApiUrl, true).generate(
      PROFILE,
      SETTINGS_BODY,
    );
    expect(result.getData.compare(fs.readFileSync(file))).toBe(0);
  });

  it('should return a pdf without signature, argument provided body', async () => {
    const file = path.resolve(__dirname, 'fixture/pdfSimple.pdf');

    nock('https://odb-docgen-functions-w.azurewebsites.net')
      .persist()
      .post('/api/ExportPdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '73609',
        eTag: '123',
      });

    const newProfile = PROFILE;
    delete newProfile.signatureDate;
    const result = await new DocumentGenerator(config.documentGeneratorApiUrl, true).generate(
      PROFILE,
      SETTINGS_BODY,
    );
    expect(result.getData.compare(fs.readFileSync(file))).toBe(0);
  });

  it('should return a pdf, argument provided body and footer', async () => {
    const file = path.resolve(__dirname, 'fixture/pdfSimple.pdf');

    nock('https://odb-docgen-functions-w.azurewebsites.net')
      .persist()
      .post('/api/ExportPdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '73609',
        eTag: '123',
      });

    const result = await new DocumentGenerator(config.documentGeneratorApiUrl, true).generate(
      PROFILE,
      SETTINGS_BODY_FOOTER,
    );
    expect(result.getData.compare(fs.readFileSync(file))).toBe(0);
  });

  it('should return a pdf, argument provided body, footer and option', async () => {
    const file = path.resolve(__dirname, 'fixture/pdfSimple.pdf');

    nock('https://odb-docgen-functions-w.azurewebsites.net')
      .persist()
      .post('/api/ExportPdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '73609',
        eTag: '123',
      });

    const result = await new DocumentGenerator(config.documentGeneratorApiUrl, true).generate(
      PROFILE,
      SETTINGS_BODY_FOOTER_OPTION,
    );
    expect(result.getData.compare(fs.readFileSync(file))).toBe(0);
  });

  it('should return true and save file in blob', async () => {
    const file = path.resolve(__dirname, 'fixture/pdfSimple.pdf');

    nock('https://odb-docgen-functions-w.azurewebsites.net')
      .persist()
      .post('/api/ExportPdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '73609',
        eTag: '123',
      });

    const result = await (
      await new DocumentGenerator(config.documentGeneratorApiUrl, true).generate(PROFILE, SETTINGS_BODY)
    ).save(PATH, BLOB_STORAGE_CS, BLOB_STORAGE_CONTAINER_NAME);
    expect(result).toBe(true);
  });

  it('should return STREAM_NOT_FOUNS', async () => {
    const result = new DocumentGenerator(config.documentGeneratorApiUrl, true).save(
      PATH,
      BLOB_STORAGE_CS,
      BLOB_STORAGE_CONTAINER_NAME,
    );
    await expect(result).rejects.toThrow(Error.DataNotFound);
  });
});
