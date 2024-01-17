<template>
  <div class="table-responsive">
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">ID</CTableHeaderCell>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Schedule Type</CTableHeaderCell>
          <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="achievement in achievements">
          <CTableDataCell>{{ achievement.id }}</CTableDataCell>
          <CTableDataCell>{{ achievement.name }}</CTableDataCell>
          <CTableDataCell>{{ achievement.scheduling.scheduleType }}</CTableDataCell>
          <CTableDataCell>{{ dateFormatter(achievement.scheduling.startDate) }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<script setup>
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/vue';
import { dateFormatter } from '../../utils/dateFormatter';

const props = defineProps({
  achievements: Array
})
</script>

<style lang="scss">
.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  .table {
    background-color: #FFFFFF;
  }
}

</style>