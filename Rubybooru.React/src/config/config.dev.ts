import { IConfig } from "./iconfig";

export const config: IConfig = {
  isProduction: false,
  restUrl: "/api/",
  queryCacheTime: 1000 * 60 * 60, // 1 hour
};
