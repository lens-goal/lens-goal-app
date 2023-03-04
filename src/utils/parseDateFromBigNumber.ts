import { BigNumberMetaData } from "../types/types";

export function parseDateFromBigNumber(bigNumber: BigNumberMetaData) {

    const date = new Date(0);
    date.setUTCSeconds(parseInt(bigNumber._hex, 16));
  
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
}