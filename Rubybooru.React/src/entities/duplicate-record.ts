import { IImage } from "./image";

export interface IDuplicateRecord {
  id: number;
  imageA: IImage;
  imageB: IImage;
}
