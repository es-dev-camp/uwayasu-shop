# uwayasu shop

## Description

This app is a slackbot for selling ginger ale.

### Based

- Slack Bolt
  - Block tool kit
- Firebase
  - Functions
  - Firestore

## Using

1. `git clone {this_repository}`
1. Install Node (and npm)
1. cd functions
  - npm install
1. Firestore environment settings
  - firebase firestore:config:set slack.bot_token=YOUR_BOT_TOKEN
  - firebase firestore:config:set slack.signing_secret=YOUR_SIGNING_secret
1. cd ..
  - firebase deploy
