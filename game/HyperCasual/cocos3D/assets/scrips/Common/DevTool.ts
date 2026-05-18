import * as custom_macro from "cc/userland/macro";

export enum DeployEnv {
  RELEASE = 0,
  QA = 1,
  DEV = 2,
  LOCAL = 3,
  OFFLINE = 4,
}

export enum DeployEnvFlags {
  RELEASE = 1 << 0,
  QA = 1 << 1,
  DEV = 1 << 2,
  LOCAL = 1 << 3,
  OFFLINE = 1 << 4,
}

export const deployKeys = Object.keys(custom_macro);

export class DevTool {
  public static log(...data: any[]) {
    if (!custom_macro.RELEASE) {
      console.log(...data);
    }
  }

  public static error(...data: any[]) {
    if (!custom_macro.RELEASE) {
      console.error(...data);
    }
  }


  public static isCheckedDeployEnv(env: DeployEnv) {
    if (env >= deployKeys.length) {
      return false;
    }

    return custom_macro[deployKeys[env]];
  }

  public static getDeployEnvStr() {
    return deployKeys.find((key) => custom_macro[key]);
  }
}
