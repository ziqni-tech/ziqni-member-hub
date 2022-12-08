<template>
  <div class="chart-wrapper">
    <apexchart class="semicircle-gauge" width="105" type="radialBar" :options="chartOptions" :series="series"></apexchart>
    <div class="chart-name">Excellent</div>
    <div class="impression-share">Impression Share</div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'SemiCircleGaugeChart',
  components: {
    apexchart: VueApexCharts,
  },
  data: function() {
    return {
      series: [76],
      chartOptions: {
        chart: {
          type: 'radialBar',
          height: 350,
          offsetY: -20,
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -125,
            endAngle: 125,
            track: {
              background: "#F3F3F3",
              color: '#70CF97',
              strokeWidth: '100%',
              margin: 5,
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#70CF97',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              value: {
                offsetY: 10,
                fontSize: '16px'
              },
              name: {
                show: false
              },
            }
          }
        },
        grid: {
          padding: {
            top: -10
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91]
          },
        },
        labels: ['Average Results'],
      },
    }
  },
};
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.chart-wrapper {
  position: relative;
  width: 120px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-top: 30px;

  .semicircle-gauge {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .chart-name {
    position: absolute;
    bottom: 20px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    font-family: 'DM Sans', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 10px;
    line-height: 13px;
    color: #70CF97;
  }

  .impression-share {
    position: absolute;
    bottom: 0;
    font-family: 'DM Sans', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #72767C;
  }
  @media screen and (max-width: $phoneWidth) {
    .impression-share {
      position: absolute;
      bottom: 0;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>