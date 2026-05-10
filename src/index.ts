import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Juan David");
  const config = readConfig();
  console.log(config);
}

main();
