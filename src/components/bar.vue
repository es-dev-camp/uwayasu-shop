<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Chart from "chart.js";
import { Bar, mixins } from "vue-chartjs";

@Component
export default class simpleBar extends Mixins(Bar, mixins.reactiveProp) {
  // TODO: このプロパティが無いとエラーになるが、使っていないので消したい
  @Prop({ type: Object, default: null }) chartData!: Chart.ChartData;

  @Prop({ type: Object, default: null }) data!: Chart.ChartData;
  @Prop({ type: Object, default: null }) options!: Chart.ChartOptions;

  mounted() {
    this.renderChart(this.data, this.options);
  }
}
</script>

<style scoped></style>
