import { IConfig } from "./iconfig";
import { configBase } from "./config.base";

export const config: IConfig = {
  ...configBase,
  isProduction: true,
  restUrl: "http://localhost:5010/api/",
  queryCacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
};
