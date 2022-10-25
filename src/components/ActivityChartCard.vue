<template>
  <CCard class="activity-card">
    <div class="activity-card-header">
      <span>Activity</span>
      <span>View All</span>
    </div>
    <CCardBody class="activity-card-body">
      <img :src="$options.graphIcon" alt="graphIcon">
<!--      <CChart-->
<!--          type="line"-->
<!--          class="chart-line"-->
<!--          :wrapper="true"-->
<!--          :data="{-->
<!--            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],-->
<!--            datasets: [-->
<!--              {-->
<!--                label: '',-->
<!--                backgroundColor: 'rgba(220, 220, 220, 1)',-->
<!--                borderColor: '#8668E1',-->
<!--                pointBackgroundColor: 'rgba(220, 220, 220, 1)',-->
<!--                pointBorderColor: '#8668E1',-->
<!--                borderJoinStyle: 'round',-->
<!--                data: [40, 20, 12, 39, 10, 40, 39],-->
<!--              },-->
<!--            ]-->
<!--          }"-->
<!--      />-->
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody } from '@coreui/vue';
import { CChart } from '@coreui/vue-chartjs';
import graphIcon from '../assets/icons/graph.svg';
export default {
  name: 'ActivityChartCard',
  components: {
    CCard,
    CCardBody,
    CChart
  },
  graphIcon
};
</script>

<style lang="scss">
.activity-card {
  margin-top: 35px;
  padding: 27px 24px;
  width: 639px;
  height: 270px;
  background: #FFFFFF;
  border-radius: 14px;

  .activity-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .activity-card-body {
    position: relative;

    .chart-line {
      width: 100%;
      height: 145px;
      position: absolute;
      //top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .bar-chart {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>