import React from "react";
import { IConfig } from "../config/iconfig";
import { config as prodConfig } from "../config/config.prod";
import { config as devConfig } from "../config/config.dev";
import process from "process";

const isDevelompemnt =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const ConfigContext = React.createContext<IConfig>(
  isDevelompemnt ? devConfig : prodConfig
);

export const useConfigContext = () => React.useContext(ConfigContext);
