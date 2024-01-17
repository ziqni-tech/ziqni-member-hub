<template>
  <div class="multiple-radialbars-chart">
    <apexchart width="150" type="radialBar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
export default {
  name: 'MultipleRadialbarsChart',
  components: {
    apexchart: VueApexCharts,
  },
  data: function() {
    return {
      series: [44, 55, 67],
      chartOptions: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '10px',
              },
              value: {
                fontSize: '18px',
                offsetY: -10,
              },
              colors: [
                "#F6CC0D",
                "#FF6370",
                "#A162F7",
              ],
              total: {
                show: true,
                label: '',
                formatter: function (w) {
                  return '$' + 249
                }
              }
            }
          }
        },
        labels: ['Apples', 'Oranges', 'Bananas'],
      }
    }
  },
  methods: {
    updateChart() {
      const max = 90;
      const min = 20;
      const newData = this.series[0].data.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      })
      // In the same way, update the series option
      this.series = [{
        data: newData
      }]
    }
  }
}
</script>
<style lang="scss">
.multiple-radialbars-chart {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
}
</style>
