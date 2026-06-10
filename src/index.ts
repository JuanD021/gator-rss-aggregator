import type { CommandsRegistry } from "./commands/commands";
import { registerCommand, runCommand } from "./commands/commands";
import { middlewareLoggedIn } from "./lib/middlewares/loggedIn";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/user";
import { handlerAddFeed, handlerListFeeds } from "./commands/feed";
import { handlerReset } from "./commands/reset";
import { handlerAggregator } from "./commands/aggregate";
import {
  handlerFollow,
  handlerFollowingByUser,
  handlerUnfollow,
} from "./commands/follow";
import { handlerBrowse } from "./commands/posts";

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
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "agg", handlerAggregator);
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(
    registry,
    "following",
    middlewareLoggedIn(handlerFollowingByUser),
  );
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

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
