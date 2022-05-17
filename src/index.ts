import TwitterApi, {ETwitterStreamEvent} from 'twitter-api-v2';
import axios from 'axios';
import * as env from 'dotenv';
env.config();

async function streamTweets(hashTag: string) {
  try {
    // OAuth 1.0a (User context)
    const userClient = new TwitterApi({
      appKey: process.env.appKey as string,
      appSecret: process.env.appSecret as string,
    });

    // Create a client with an already known bearer token
    const appOnlyClient = new TwitterApi(process.env.appOnlyClient as string);
    // OR - you can also create a app-only client from your consumer keys -
    const client = await userClient.appLogin();
    const rules = await client.v2.streamRules();
    if (rules.data?.length) {
      await client.v2.updateStreamRules({
        delete: {ids: rules.data.map(rule => rule.id)},
      });
    }

    // Add our rules
    await client.v2.updateStreamRules({
      add: [{value: hashTag}],
    });

    const stream = await client.v2.searchStream({
      'tweet.fields': ['author_id', 'created_at'],
      expansions: ['referenced_tweets.id'],
    });
    // Enable auto reconnect
    stream.autoReconnect = true;

    stream.on(ETwitterStreamEvent.Data, async tweet => {
      await axios.put(process.env.streamTweetsApi as string, tweet);
      console.log(JSON.stringify(tweet, null, 2));
    });
  } catch (e) {
    console.log('🐱‍🏍', JSON.stringify(e, null, 2));
  }
}

streamTweets('#USA').then();
