import * as functions from "firebase-functions";
import admin = require("firebase-admin");
import * as moment from "moment";

admin.initializeApp(functions.config().firebase);
const db: FirebaseFirestore.Firestore = admin.firestore();

export class shop {
  /**
   * Get total user deposit
   * @param userName - User name for deposit
   * @returns Deposit total amount
   */
  async getDepositTotal(userName: string): Promise<number> {
    const paidCollection = db.collection("paid");
    const queryRef = paidCollection.where("userName", "==", userName);
    const filteredPaids = await queryRef.get();

    let depositTotal = 0;
    filteredPaids.docs.forEach(paid => {
      depositTotal += paid.data().deposit;
    });
    return depositTotal;
  }

  /**
   * Get total user deposit
   * @param userId - User Id for deposit
   * @returns Deposit total amount
   */
  async getDepositInfo(user: IUser): Promise<IDepositInfo> {
    const journals = db.collection('journal');
    const queryRef = journals.where('user.id', '==', user.id);

    const filteredJournals = await queryRef.get();
    const total = filteredJournals.docs.length;
    const service = Math.floor(total / 4);
    const deposit = await this.getDepositTotal(user.name);

    return {
      totalPurchases: total,
      totalAmountPaid: deposit,
      serviceCount: service,
      paymentAmount: (total - service) * 100 - deposit
    };
  }

  /**
   * Register payment in the database
   * @param userName - User name for deposit
   * @param deposit - Deposit amount
   */
  async addPaid(userName: string, deposit: number): Promise<void> {
    const paidCollection = db.collection("paid");
    await paidCollection.add({
      userName: userName,
      deposit: deposit,
      createddAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  /**
   * Record purchase history in journal
   * @param journals - Canceled user id
   * @param itemName - Purchased item name
   * @param itemId - Purchased item id
   * @returns Document reference id
   */
  async buy(user: IUser, itemName: string, itemId: string): Promise<string> {
    const journals = db.collection("journal");
    const ref = await journals.add({
      user: user,
      item: {
        name: itemName,
        id: itemId
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }

  /**
   * Cancel purchase
   * Cannot be canceled after 1 hour from purchase
   * @param userId - Canceled user id
   * @param journalId - Target journal id
   */
  async cancel(userId: string, journalId: string): Promise<cancelStatus> {
    const document = db.collection("journal").doc(journalId);
    const journal = await document.get();
    if (journal.exists) {
      const data = journal.data();
      if (data && data.user.id !== userId) {
        return cancelStatus.purchaseOfOthers;
      } else if (
        data &&
        data.createdAt.seconds <
          moment()
            .add(-1, "h")
            .unix()
      ) {
        return cancelStatus.expired;
      } else {
        await document.delete();
        return cancelStatus.success;
      }
    } else {
      return cancelStatus.notExist;
    }
  }
}

export enum cancelStatus {
  success,
  fail,
  notExist,
  purchaseOfOthers,
  expired
}


export interface IUser {
  name: string;
  id: string;
  team_id: string;
  username: string;
}

interface IDepositInfo {
  totalPurchases: number;
  totalAmountPaid: number;
  serviceCount: number;
  paymentAmount: number;
}
