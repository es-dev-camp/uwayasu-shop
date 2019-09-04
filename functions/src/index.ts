import * as functions from "firebase-functions";
import { App, ExpressReceiver, SayArguments } from "@slack/bolt";
import { shop, cancelStatus } from "./shop";

const expressReceiver = new ExpressReceiver({
  signingSecret: functions.config().slack.signing_secret,
  endpoints: "/events"
});

// Initializes your app with your bot token and signing secret
const app = new App({
  receiver: expressReceiver,
  token: functions.config().slack.bot_token
});
app.error(console.log);

app.message(/^menu$/, ({ say }) => {
  const responce = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "uwayasu へようこそ!\nお支払いは1,000円単位でお願いします。\n\n *購入したい商品を選択してください。*"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "料金は 1本 100円 です。\n *3本購入で1本サービス！*"
        },
        accessory: {
          type: "image",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTla__OXLZesYQx3LJejrvFiO2TM73Dh1ouAcZduMxg6HSxzZecWw",
          alt_text: "ジンジャーエールのビン"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "clickItem1",
            text: {
              type: "plain_text",
              emoji: true,
              text: "ジンジャーエール（茶）辛口"
            },
            value: "item1"
          },
          {
            type: "button",
            action_id: "clickItem2",
            text: {
              type: "plain_text",
              emoji: true,
              text: "ジンジャーエール（赤）Dry"
            },
            value: "item2"
          },
          {
            type: "button",
            action_id: "clickItem3",
            text: {
              type: "plain_text",
              emoji: true,
              text: "トニックウォーター（青）"
            },
            value: "item3"
          }
        ]
      }
    ]
  };
  say(responce as SayArguments);
});

app.action(/clickItem[1-3]/, async ({ body, ack, say, context }) => {
  ack();
  const selectedItem = (body as any).actions[0];
  const itemName = selectedItem.text.text;
  const itemId = selectedItem.value;

  const uwayasu = new shop();
  const userInfo = await getUserInfo(context.botToken, body.user.id);
  const documentId = await uwayasu.buy(userInfo.id, itemName, itemId);
  const depositInfo = await uwayasu.getDepositInfo(userInfo.id, userInfo.name);

  say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${
            body.user.id
          }> さん ${itemName} のご購入ありがとうございます
            *購入ID:* ${documentId}

            *総購入数:* ${depositInfo.totalPurchases.toLocaleString()}本 *サービス本数:* ${depositInfo.serviceCount.toLocaleString()}本
            *お支払残額:* ${
              depositInfo.paymentAmount
            }円 (お支払済: ${depositInfo.totalAmountPaid.toLocaleString()}円)
          `
        }
      }
    ]
  } as SayArguments);
});

app.message(/^cancel (.+)$/, async ({ message, context, say }) => {
  const id = context.matches[1];

  const uwayasu = new shop();
  const result = await uwayasu.cancel(message.user, id);
  if (result === cancelStatus.success) {
    say(`<@${message.user}> さん 購入をキャンセルしました (${id})`);
  } else if (result === cancelStatus.notExist) {
    say(`既にキャンセル済みです (${id})`);
  } else if (result === cancelStatus.purchaseOfOthers) {
    say(`<@${message.user}> さん 他の方の購入はキャンセルできません (${id})`);
  } else if (result === cancelStatus.expired) {
    say(
      `<@${message.user}> さん 購入から1時間以上経過したためキャンセルできません (${id})`
    );
  }
});

app.message(/^bill$/, async ({ message, context, say }) => {
  const uwayasu = new shop();

  const userInfo = await getUserInfo(context.botToken, message.user);
  const depositInfo = await uwayasu.getDepositInfo(userInfo.id, userInfo.name);
  say(`<@${userInfo.id}> さん
    *総購入数:* ${depositInfo.totalPurchases.toLocaleString()}本 *サービス本数:* ${depositInfo.serviceCount.toLocaleString()}本
    *お支払残額:* ${
      depositInfo.paymentAmount
    }円 (お支払済: ${depositInfo.totalAmountPaid.toLocaleString()}円)
  `);
});

const administrators = ["U223M954Z"];

app.message(/^paid (.+?) (.+)$/, async ({ message, context, say }) => {
  if (!administrators.includes(message.user)) {
    say(`<@${message.user}> さん 会計処理は管理者でないと行えません`);
  }
  const deposit = Number.parseInt(context.matches[1]);
  const userName = context.matches[2];
  console.log(`deposit: ${deposit}, userName: ${userName}`);

  const uwayasu = new shop();
  await uwayasu.addPaid(userName, deposit);

  const depositTotal = await uwayasu.getDepositTotal(userName);
  say(
    `${userName} さんから${deposit.toLocaleString()}ご入金頂きました。\n入金合計額は${depositTotal.toLocaleString()}円です。`
  );
});

async function getUserInfo(botToken: string, userId: string): Promise<IUser> {
  const info = await app.client.users.info({
    token: botToken,
    user: userId
  });
  return {
    name: (info as any).user.name,
    id: userId
  };
}

export interface IUser {
  name: string;
  id: string;
}

exports.slack = functions.https.onRequest(expressReceiver.app);
