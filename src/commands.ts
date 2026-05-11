import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.log("username is required");
    process.exit(1);
  }
  const userName = args[0];
  setUser(userName);
  console.log(`User ${userName} has been set`);
}

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const command = registry[cmdName];
  command(cmdName, ...args);
}
