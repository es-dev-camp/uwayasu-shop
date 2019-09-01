import firebase from "firebase/app";
import "firebase/firestore";
import Chart from "chart.js";
import moment from "moment";
import IJournal from "@/models/IJournal";

export default class journal {
  private journalsCache: IJournal[] = [];
  private unsub: () => void = () => {};

  searchWord: string = "";

  constructor() {
    this.sub();
  }

  get dataSet(): IJournal[] {
    return this.journalsCache;
  }

  get filterdDataSet(): IJournal[] {
    return this.journalsCache
      ? this.journalsCache.filter(j => {
          return (
            j.item.name.toString().indexOf(this.searchWord) !== -1 ||
            j.user.name.toString().indexOf(this.searchWord) !== -1
          );
        })
      : this.journalsCache;
  }

  get dailySummary(): Chart.ChartData {
    // ジャーナルデータを日付別に集計
    const result: any = {};
    this.filterdDataSet.forEach(j => {
      const date = moment.unix(j.createdAt.seconds).format("MM-DD");
      result[date] = (result[date] || 0) + 1;
    });

    // 日付順にソートして ChartData 形式に詰め替え
    const labels: string[] = [];
    const data: number[] = [];
    for (let [key, value] of Object.entries(result).sort()) {
      labels.push(key);
      data.push(Number(value));
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "購入本数",
          backgroundColor: "#45A4E9",
          data: data
        }
      ]
    };
  }

  private sub() {
    let collection = firebase.firestore().collection("journal");
    this.unsub = collection.onSnapshot(
      snapshot => {
        const journalData: IJournal[] = [];
        snapshot.forEach(j => {
          journalData.push(j.data() as IJournal);
        });
        this.journalsCache = journalData;
      },
      err => {
        // console.log(`Encountered error: ${err}`);
      }
    );
  }

  atouch() {
    this.sub();
  }

  detouch() {
    this.unsub();
  }
}
