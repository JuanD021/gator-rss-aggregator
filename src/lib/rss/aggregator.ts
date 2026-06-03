import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching RSS Feed");
  }

  const feedData = await response.text();

  const parser = new XMLParser({ processEntities: false });
  const parsedFeed = parser.parse(feedData);
  const feedChannel = parsedFeed.rss?.channel;

  if (
    !feedChannel ||
    !feedChannel.title ||
    !feedChannel.link ||
    !feedChannel.description
  ) {
    throw new Error(
      "Fields required from RSS were not found: title, link, description",
    );
  }

  const items: any[] = Array.isArray(feedChannel.item)
    ? feedChannel.item
    : [feedChannel.item];

  const feedItems: RSSItem[] = items.filter((item) => {
    return (item.title, item.link, item.description, item.pubDate);
  });

  const RSSFeedObj: RSSFeed = {
    channel: {
      title: feedChannel.title,
      link: feedChannel.link,
      description: feedChannel.description,
      item: feedItems,
    },
  };

  return RSSFeedObj;
}
