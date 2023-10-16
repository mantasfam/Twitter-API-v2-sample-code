// Get Tweet objects by ID, using user authentication
// https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/quick-start

import got from "got";
import { createHmac } from "crypto";
import OAuth from "oauth-1.0a";

// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CONSUMER_KEY='YOUR-KEY'
// export CONSUMER_SECRET='YOUR-SECRET'
const consumer_key = "YOUR-SECRET";
const consumer_secret = "YOUR-SECRET";

// These are the parameters for the API request
// specify Tweet IDs to fetch, and any additional fields that are required
// by default, only the Tweet ID and text are returned
const tweetIDs = "1711084916950118569"; // Edit the Tweet IDs to look up
const params = "tweet.fields=lang,author_id&user.fields=created_at"; // Edit optional query parameters here

const endpointURL = `https://api.twitter.com/2/tweets?ids=${tweetIDs}&${params}`;
console.log("endpointURL", endpointURL);

const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) => createHmac("sha1", key).update(baseString).digest("base64"),
});

async function getRequest({ oauth_token, oauth_token_secret }) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "GET",
      },
      token
    )
  );

  const req = await got(endpointURL, {
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2TweetLookupJS",
    },
  });

  if (req.body) {
    return JSON.parse(req.body);
  } else {
    throw new Error("Unsuccessful request");
  }
}

(async () => {
  try {
    const oAuthAccessToken = {
      oauth_token: "YOUR-TOKEN",
      oauth_token_secret: "YOUR-TOKEN-SECRET",
    };
    console.log("oAuthAccessToken", oAuthAccessToken);
    // Make the request
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null,
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();
