<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          {{ msg }}
        </h1>
      </v-flex>

      <v-flex xs12>
        <v-layout justify-center>
          <simple-bar :data="dataCollection" :width="1024" :height="768">
          </simple-bar>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Chart from "chart.js";
import simpleBar from "@/components/bar.vue";

@Component({
  components: {
    simpleBar
  }
})
export default class HelloWorld extends Vue {
  chartOption: Chart.ChartOptions = {};

  dataCollection: Chart.ChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "asdf",
      "asdfqwer"
    ],
    datasets: [
      {
        label: "購入本数",
        backgroundColor: "#45A4E9",
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
      }
    ]
  };

  @Prop({
    type: String,
    default: "uwayasu をご利用いただきありがとうございます"
  })
  msg!: string;
}
</script>

<style scoped></style>
