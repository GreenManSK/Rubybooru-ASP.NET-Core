import { IConfig } from "./iconfig";

export const config: IConfig = {
  isProduction: true,
  restUrl: "http://localhost:5010/api/",
  queryCacheTime: 1000 * 60 * 60 * 24 * 7 // 7 days
};
