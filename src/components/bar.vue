<script lang="ts">
import { Component, Watch, Mixins, Prop } from "vue-property-decorator";
import Chart from "chart.js";
import { Bar, mixins } from "vue-chartjs";

@Component
export default class simpleBar extends Mixins(Bar, mixins.reactiveProp) {
  @Prop({ type: Object, default: null }) chartData!: Chart.ChartData;
  @Prop({ type: Object, default: null }) options!: Chart.ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>

<style scoped></style>
