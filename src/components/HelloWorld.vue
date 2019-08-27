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
          <simple-bar
            :chart-data="dataCollection"
            :options="chartOption"
            :width="1024"
            :height="768"
          >
          </simple-bar>
          <v-btn @click="onUpdateData">更新</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Chart from "chart.js";
import journal from "@/models/journal";
import simpleBar from "@/components/bar.vue";

@Component({
  components: {
    simpleBar
  }
})
export default class HelloWorld extends Vue {
  chartOption: Chart.ChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 10
          },
          gridLines: {
            display: true
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: false
          }
        }
      ]
    },
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false
  };

  dataCollection: Chart.ChartData = {};

  @Prop({
    type: String,
    default: "uwayasu をご利用いただきありがとうございます"
  })
  msg!: string;

  async created() {
    await this.onUpdateData();
  }

  async onUpdateData() {
    const j = new journal();
    this.dataCollection = await j.getJournalData();
  }
}
</script>

<style scoped></style>
