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
          "text": "料金は 1本 100円 です。\n *3本購入で1本サービス！*"
        },
        "accessory": {
          "type": "image",
          "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTla__OXLZesYQx3LJejrvFiO2TM73Dh1ouAcZduMxg6HSxzZecWw",
          "alt_text": "ジンジャーエールのビン"
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "action_id": "clickItem1",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "ジンジャーエール（茶）辛口"
            },
            "value": "item1"
          },
          {
            "type": "button",
            "action_id": "clickItem2",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "ジンジャーエール（赤）Dry"
            },
            "value": "item2"
          },
          {
            "type": "button",
            "action_id": "clickItem3",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "トニックウォーター（青）"
            },
            "value": "item3"
          }
        ]
      }
    ]
  };
  say(responce as SayArguments);
});

app.action(/clickItem[1-3]/, async ({ body, ack, say }) => {
  ack();
  const selectedItem = (body as any).actions[0];
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
  const id = context.matches[1];
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

app.message(/^bill$/, async ({ message, context, say }) => {

  // 購入数をカウント
  const journals = db.collection('journal');
  const queryRef = journals.where('user.id', '==', message.user);
  const filteredJournals = await queryRef.get();
  const total = filteredJournals.docs.length;
  const service = Math.floor(total / 4);


  const userInfo = await app.client.users.info({
    token: context.botToken,
    user: message.user
  });
  const deposit = await getDepositTotal((userInfo as any).user.name);

  say(`<@${message.user}> さんの総購入数は${total.toLocaleString()}本\nお支払額は ${((total - service) * 100 - deposit).toLocaleString()}円です。`);
});

const administrators = ['U223M954Z'];

app.message(/^paid (.+?) (.+)$/, async ({ message, context, say }) => {
  if (!administrators.includes(message.user)) {
    say(`<@${message.user}> さん 会計処理は管理者でないと行えません`);
  }
  const deposit = Number.parseInt(context.matches[1]);
  const userName = context.matches[2];
  console.log(`deposit: ${deposit}, userName: ${userName}`);

  // 入金処理
  const paidCollection = db.collection('paid');
  await paidCollection.add({
    userName: userName,
    deposit: deposit,
    createddAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const depositTotal = await getDepositTotal(userName);
  say(`${userName} さんから${deposit.toLocaleString()}ご入金頂きました。\n入金合計額は${depositTotal.toLocaleString()}円です。`);
})

async function getDepositTotal(userName: string) {
  const paidCollection = db.collection('paid');
  const queryRef = paidCollection.where('userName', '==', userName);
  const filteredPaids = await queryRef.get();

  let depositTotal = 0;
  filteredPaids.docs.forEach(paid => {
    depositTotal += paid.data().deposit
  });
  return depositTotal;
}

exports.slack = functions.https.onRequest(expressReceiver.app);
