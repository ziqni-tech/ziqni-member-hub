<template>
  <CCard class="pie-chart-card">
    <CCardBody class="pie-chart-card-body">
      <div class="title-container">
        <CCardImage class="title-icon" :src="$options.titleIcon" />
        <CCardTitle class="title">Range</CCardTitle>
      </div>
      <div class="chart-wrapper">
        <CChart
            class="chart"
            type="doughnut"
            :data="{
            labels: [],
            datasets: [
                {
                  backgroundColor: ['#FF7E86', '#F4F5F9'],
                  data: [45, 55],
                },
            ],
          }"
        />
        <span class="chart-percentage-data">45%</span>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody, CCardImage, CCardTitle } from '@coreui/vue';
import { CChart } from '@coreui/vue-chartjs';
import titleIcon from '../assets/icons/pie-chart-title-icon.svg';
export default {
  name: 'PieChartCard',
  titleIcon,
  components: {
    CCardTitle,
    CCard,
    CCardBody,
    CCardImage,
    CChart
  }
};
</script>

<style lang="scss">
.pie-chart-card {
  width: 198px;
  height: 228px;
  background: #FFFFFF;
  box-shadow: 0px 7px 21px rgba(179, 179, 179, 0.25);
  border-radius: 14px;
  border: none;

  .pie-chart-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title-icon {
        width: 38px;
        height: 38px;
      }

      .title {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;
        color: #242731;
      }
    }

    .chart-wrapper {
      position: relative;
      .chart {
        width: 112px;
        height: 112px;
      }

      .chart-percentage-data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;
        color: #242731;
      }
    }
  }
}
</style>