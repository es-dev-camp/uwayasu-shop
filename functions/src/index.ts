import * as functions from 'firebase-functions';
const config = functions.config();

import admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

import { App, ExpressReceiver, SayArguments } from '@slack/bolt';
const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.signing_secret,
  endpoints: '/events'
});

import * as moment from 'moment';

// Initializes your app with your bot token and signing secret
const app = new App({
  receiver: expressReceiver,
  token: config.slack.bot_token
});
app.error(console.log);

app.message(/^menu$/, ({ message, say }) => {
  const responce = {
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "uwayasu へようこそ!\nお支払いは1,000円単位でお願いします。\n\n *購入したい商品を選択してください。*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "料金は1本100円です。 *3本購入で1本サービス！*"
        },
        "accessory": {
          "type": "static_select",
          "action_id": "selected_changed",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "ジンジャーエール（茶）辛口",
                "emoji": true
              },
              "value": "item1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "ジンジャーエール（赤）Dry",
                "emoji": true
              },
              "value": "item2"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "トニックウォーター（青）",
                "emoji": true
              },
              "value": "item3"
            }
          ]
        }
      }
    ]
  };
  say(responce as SayArguments);
});

app.action('selected_changed', async ({ body, ack, say }) => {
  ack();

  const selectedItem = (body as any).actions[0].selected_option;
  const journals = db.collection('journal');
  const document = await journals.add({
    user: body.user,
    item: {
      name: selectedItem.text.text,
      id: selectedItem.value
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `<@${body.user.id}> さん ${selectedItem.text.text} のご購入ありがとうございます\n${document.id}`
        }
      }
    ]
  } as SayArguments);
});

app.message(/^cancel (.+)$/, async ({ message, context, say }) => {
  const id = context.matches[0];
  const document = db.collection('journal').doc(id);
  const journal = await document.get();
  if (journal.exists) {
    const data = journal.data();
    if (data && data.user.id !== message.user) {
      say(`<@${message.user}> さん 他の方の購入はキャンセルできません (${id})`);
    } else if (data && data.createdAt.seconds < moment().add(-1, 'h').unix()) {
      say(`<@${message.user}> さん 購入から1時間以上経過したためキャンセルできません (${id})`);
    } else {
      await document.delete();
      say(`<@${message.user}> さん 購入をキャンセルしました (${id})`);
    }
  } else {
    say(`既にキャンセル済みです (${id})`);
  }
});

app.message(/^bill$/, async ({ message, say }) => {
  const journals = db.collection('journal');
  const queryRef = journals.where('user.id', '==', message.user);
  const filteredJournals = await queryRef.get();

  const total = filteredJournals.docs.length;
  const service = Math.floor(total / 4);
  say(`<@${message.user}> さんの総購入数は${total}本\n合計額は ${(total - service) * 100}円です。`);
});

exports.slack = functions.https.onRequest(expressReceiver.app);