# uwayasu-shop

This app is a slackbot for selling ginger ale.

## Web application 

### Based

- Vue.js
- TypeScript
- Vuetify

### project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Slack bot application project setup

### Based

- Slack Bolt
  - Block tool kit
- Firebase
  - Functions
  - Firestore

### Using

1. `git clone {this_repository}`
1. Install Node (and npm)
1. cd functions
  - npm install
1. Firestore environment settings
  - firebase firestore:config:set slack.bot_token=YOUR_BOT_TOKEN
  - firebase firestore:config:set slack.signing_secret=YOUR_SIGNING_secret
1. cd ..
  - firebase deploy