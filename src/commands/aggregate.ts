import { fetchFeed } from "../lib/rss/aggregator";

export async function handlerAggregator(_: string) {
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feedObj = await fetchFeed(feedURL);
    console.log(JSON.stringify(feedObj, null, 2));
}
