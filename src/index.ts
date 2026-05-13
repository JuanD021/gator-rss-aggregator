import type { CommandsRegistry } from "./commands/commands.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister } from "./commands/userCommands.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Not enough arguments were provided");
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const argsArr = args.slice(1);
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

  try {
    await runCommand(registry, cmdName, ...argsArr);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
