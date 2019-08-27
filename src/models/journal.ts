import firebase from "firebase/app";
import "firebase/firestore";
import Chart from "chart.js";
import moment from "moment";
import IJournal from "@/models/IJournal";

export default class journal {
  async getJournalData(): Promise<Chart.ChartData> {
    const journalRef = firebase.firestore().collection("journal");
    const journals = await journalRef.get();

    // 取得したジャーナルデータを日付別に集計
    const result: any = {};
    journals.forEach(j => {
      const data = j.data() as IJournal;
      const date = moment.unix(data.createdAt.seconds).format("MM-DD");
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
}
