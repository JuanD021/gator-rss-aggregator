import type { CommandsRegistry } from "./commands.js";
import { registerCommand, handlerLogin, runCommand } from "./commands.js";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Not enough arguments were provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const argsArr = args.slice(1);
  runCommand(registry, cmdName, ...argsArr);
}

main();
