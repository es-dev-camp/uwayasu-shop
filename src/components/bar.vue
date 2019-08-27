<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Chart from "chart.js";
import { Bar, mixins } from "vue-chartjs";

@Component
export default class simpleBar extends Mixins(Bar, mixins.reactiveProp) {
  @Prop({ type: Object, default: null }) data!: Chart.ChartData;
  @Prop({ type: Object, default: null }) options!: Chart.ChartOptions;

  mounted() {
    this.renderChart(this.data, this.options);
  }
}
</script>

<style></style>
