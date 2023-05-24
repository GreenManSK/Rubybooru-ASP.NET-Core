import { IImage } from "./image";

export enum DuplicateRecordResolution {
  A,
  B,
  NotDuplicate,
}

export interface IDuplicateRecord {
  id: number;
  imageA: IImage;
  imageB: IImage;
}
