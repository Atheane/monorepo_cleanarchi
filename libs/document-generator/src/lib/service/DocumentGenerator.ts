import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import { Process } from './Process';
import { transformPayload } from './tools';
import { DocumentOption } from '../type/DocumentOption';
import { AbstractDocumentGenerator } from '../type/AbstractDocumentGenerator';
import { DEFAULT_CONFIG } from '../env/DefaultConfig';
import { Settings } from '../type/Settings';
import { Error } from '../type/Error';

const writeFileAsync = util.promisify(fs.writeFile);

export class DocumentGenerator extends AbstractDocumentGenerator {
  private process: Process;
  private serviceClient = null;
  private containerClient = null;

  /* istanbul ignore next */
  constructor(private documentGeneratorApiUrl: string, private isInTestMode = false) {
    super();
    this.process = new Process(this.isInTestMode);
  }

  async generate(payload: any, setting: Settings): Promise<AbstractDocumentGenerator> {
    const { option, ...other } = setting;
    payload = transformPayload(payload, setting.body);
    const compiledHTMLType = await this.process.compiled(payload, other);
    const footerPath = `${__dirname}/file.footer.html`;
    let wkConfig: DocumentOption = { ...DEFAULT_CONFIG };
    if (option) {
      wkConfig = { ...wkConfig, ...option };
    }
    if (compiledHTMLType.footer) {
      await writeFileAsync(footerPath, compiledHTMLType.footer, 'UTF-8');
      /* eslint-disable-next-line */
      wkConfig = { ...wkConfig, footerHtml: footerPath };
    }

    const response = await axios({
      url: this.documentGeneratorApiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      data: compiledHTMLType.content,
      responseType: 'arraybuffer',
    });

    this.data = response.data;
    return this;
  }

  async save(path: string, connectionString: string, containerName: string): Promise<Boolean> {
    if (this.data) {
      console.log(`initiating file storage`);
      this.serviceClient = await BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient = await this.serviceClient.getContainerClient(containerName);

      console.log(`creating PDF`);
      const blobClient = this.containerClient.getBlobClient(path);
      const blockBlobClient = blobClient.getBlockBlobClient();
      const uploadBlobResponse = await blockBlobClient.uploadData(this.data, {
        blobHTTPHeaders: { blobContentType: 'application/pdf' },
      });
      console.log(`Uploaded block blob ${path} successfully`, uploadBlobResponse.requestId);
      return true;
    } else {
      throw new Error.DataNotFound();
    }
  }
}
