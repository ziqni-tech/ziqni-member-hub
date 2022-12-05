<template>
  <CCard class="total-info-card">
    <CCardBody class="total-info-card-body">
      <TotalInfoItems :items="totalInfoItems" />
      <CCardImage :src="cardIcon" />
    </CCardBody>
  </CCard>
</template>

<script setup>
import { CCard, CCardBody, CCardImage } from '@coreui/vue'
import TotalInfoItems from './TotalInfoItems';
import cardIcon from '../assets/icons/hand-with-medal.svg'

const totalInfoItems = [
  {title: 'Fuel Usage', value: '2903.89 Ltr'},
  {title: 'KM Driven', value: '2903.89 Ltr'},
  {title: 'Total Cost', value: '$3,00,290.00'},
  {title: 'Top Speed', value: '$5.2K'},
]

</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.total-info-card {
  width: 361px;
  height: 534px;
  background: $total-info-card-background-color;
  box-shadow: 0 20px 101px rgba(148, 148, 148, 0.25);
  border-radius: 14px;

  .total-info-card-body {
    padding: 0 23px;
  }
}
</style>