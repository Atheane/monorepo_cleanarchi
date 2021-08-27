import { config } from '../../../config/config.env';
import { BusService } from '../../bus';

/**
 * Generates a pdf with the compiled payload
 * @param {Object} compiled The compiled payload
 */
export default async function send(compiled) {
  const { serviceBusConfiguration } = config;
  const busService = new BusService(serviceBusConfiguration);
  const message = {
    body: compiled,
  };

  await busService.send(serviceBusConfiguration.pdfTopic, message);
}
