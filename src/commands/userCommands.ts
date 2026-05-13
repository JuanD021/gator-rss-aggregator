import { setUser } from "../config.js";
import { createUser, getUser } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const userExisting = await getUser(userName);
  if (!userExisting) {
    throw new Error("Account doesn't exist");
  }
  setUser(userName);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const userExisting = await getUser(userName);
  if (userExisting) {
    throw new Error(`Username <${userName}> already exists`);
  }
  const newUser = await createUser(userName);
  console.log(`New user: ${newUser.name} was succesfully created`);
  setUser(newUser.name);
}
