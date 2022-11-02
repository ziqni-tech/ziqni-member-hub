<template>
  <CTable bordered class="leader-board">
    <CTableBody>
      <CTableRow>
        <CTableHeaderCell scope="row">1</CTableHeaderCell>
        <CTableDataCell>Mark</CTableDataCell>
        <CTableDataCell>Otto</CTableDataCell>
        <CTableDataCell>@mdo</CTableDataCell>
      </CTableRow>
      <CTableRow>
        <CTableHeaderCell scope="row">2</CTableHeaderCell>
        <CTableDataCell>Mark</CTableDataCell>
        <CTableDataCell>Otto</CTableDataCell>
        <CTableDataCell>@mdo</CTableDataCell>
      </CTableRow>
      <CTableRow>
        <CTableHeaderCell scope="row">3</CTableHeaderCell>
        <CTableDataCell>Mark</CTableDataCell>
        <CTableDataCell>Otto</CTableDataCell>
        <CTableDataCell>@mdo</CTableDataCell>
      </CTableRow>
      <CTableRow>
        <CTableHeaderCell scope="row">4</CTableHeaderCell>
        <CTableDataCell>Mark</CTableDataCell>
        <CTableDataCell>Otto</CTableDataCell>
        <CTableDataCell>@mdo</CTableDataCell>
      </CTableRow>
      <CTableRow>
        <CTableHeaderCell scope="row">5</CTableHeaderCell>
        <CTableDataCell>Mark</CTableDataCell>
        <CTableDataCell>Otto</CTableDataCell>
        <CTableDataCell>@mdo</CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

<script>
import { CTable, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/vue';
export default {
  name: 'Leaderboard',
  components: {
    CTable,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell
  }
};
</script>

<style lang="scss">
.leader-board {
  box-shadow: 0px 7px 21px rgba(180, 180, 180, 0.25);
}
</style>