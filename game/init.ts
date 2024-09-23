import { SPAInitializer } from "@common-module/app";
import AppConfig, { IAppConfig } from "./AppConfig.js";

export default async function init(config: IAppConfig) {
  AppConfig.init(config);
  SPAInitializer.init();
}
