import { setUser, readConfig } from "../config.js";
import { createUser, getUser, getAllUsers } from "../lib/db/queries/users.js";

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
  setUser(newUser.name);
  console.log(`New user: ${newUser.name} was succesfully created`);
}

export async function handlerUsers(_: string) {
  const users = await getAllUsers();
  const { currentUserName } = readConfig();

  users.forEach((user) => {
    if (user.name === currentUserName) {
      console.log(`${user.name} (current)`);
    } else {
      console.log(user.name);
    }
  });
}
