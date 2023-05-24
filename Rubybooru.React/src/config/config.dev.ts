import { IConfig } from "./iconfig";
import { configBase } from "./config.base";

export const config: IConfig = {
  ...configBase,
  isProduction: false,
  restUrl: "http://localhost:5010/api",
  queryCacheTime: 1000 * 60 * 60, // 1 hour
};
