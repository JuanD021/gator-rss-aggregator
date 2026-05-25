import { deleteUsers } from "../lib/db/queries/users.js";

export async function handlerReset(_: string) {
  await deleteUsers();
  console.log("Database reset succesfully");
}
