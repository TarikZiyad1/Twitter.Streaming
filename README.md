# Twitter.Streaming

This Application is meant to stream data form Twitter into `Twitter.Monitoring` serverless application for a certain hashtag real time.

The application can run locally or on an EC2 instance.

The application will push data into the another `Twitter.Monitoring` application for the [repo](#https://github.com/TarikZiyad1/Twitter.Monitoring)

Ensure that you put your own environment variables in the `.env` file for:

- streamTweetsApi (the API you have after deploying the `Twitter.Monitoring`)
- appKey
- appSecret
- appOnlyClient
  