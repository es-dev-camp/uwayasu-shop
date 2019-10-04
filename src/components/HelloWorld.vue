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
            :chart-data="getDailySummary"
            :options="chartOption"
            :width="1024"
            :height="360"
          >
          </simple-bar>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="getFilterdDataSet"
          item-key="createdAt.seconds"
          class="elevation-1"
          sort-by="createdAt"
          :sort-desc="true"
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
            ></v-text-field>
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ item.createdAt | displayDateTime }}
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Chart from "chart.js";
import { journalModule } from "@/modules/journalModule";
import simpleBar from "@/components/bar.vue";

const Super = Vue.extend({
  methods: journalModule.mapActions(["detouch", "setSearchWord"]),
  computed: journalModule.mapGetters([
    "getDataSet",
    "getSearchWord",
    "getFilterdDataSet",
    "getDailySummary"
  ])
});

@Component({
  components: {
    simpleBar
  }
})
export default class HelloWorld extends Super {
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

  get headers() {
    return [
      { text: "Datetime", value: "createdAt" },
      { text: "UserName", value: "user.name" },
      { text: "Item", value: "item.name" }
    ];
  }

  get search() {
    return this.getSearchWord;
  }
  set search(value: string) {
    this.setSearchWord(value);
  }

  @Prop({
    type: String,
    default: "uwayasu をご利用いただきありがとうございます"
  })
  msg!: string;
}
</script>

<style scoped></style>
