import * as moment from 'moment';

export function isBetween(startDate: Date, endDate: Date): boolean {
  const currentDate = moment();
  return currentDate.isAfter(startDate) && currentDate.isBefore(endDate);
}
