import os from "node:os";
import path from "node:path";
import fs from "node:fs";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string) {
  const configFile = readConfig();
  configFile.currentUserName = username;
  writeConfig(configFile);
}

export function readConfig(): Config {
  const pathfile = getConfigFilePath();
  const data = fs.readFileSync(pathfile, { encoding: "utf8" });
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }

  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const configFile: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
  return configFile;
}

function writeConfig(config: Config): void {
  const pathfile = getConfigFilePath();

  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(pathfile, data, { encoding: "utf-8" });
}

function getConfigFilePath(): string {
  const homedir = os.homedir();
  const configFile = ".gatorconfig.json";
  return path.join(homedir, configFile);
}
