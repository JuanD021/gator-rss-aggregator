export function parseDuration(durationStr: string) {
  const regexp = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.toLowerCase().match(regexp);
  if (!match) {
    throw new Error(
      `${durationStr} is not a valid duration. Usage: 1h | 20m | 60s | 20000ms`,
    );
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      return value;
  }
}

export function handleError(error: unknown) {
  console.error(
    `Error scraping feeds: ${error instanceof Error ? error.message : error}`,
  );
}
