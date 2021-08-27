import { BlobServiceClient } from '@azure/storage-blob';

let serviceClient = null;
let containerClient = null;
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

export async function initFileStorage(connectionString, containerName) {
  serviceClient = await BlobServiceClient.fromConnectionString(connectionString);
  containerClient = await serviceClient.getContainerClient(containerName);
}

export async function createFile(name, stream, context) {
  const blobClient = containerClient.getBlobClient(name);
  const blockBlobClient = blobClient.getBlockBlobClient();
  const uploadBlobResponse = await blockBlobClient.uploadStream(
    stream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
    { blobHTTPHeaders: { blobContentType: 'application/pdf' } },
  );
  context.log(`Uploaded block blob ${name} successfully`, uploadBlobResponse.requestId);
}
