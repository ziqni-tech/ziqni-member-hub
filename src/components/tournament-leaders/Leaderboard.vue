<template>
  <div class="leader-board">
    <div class="leader-board__header">
      <span>player</span>
      <span># Tournaments Played</span>
      <span>Earnings</span>
    </div>
    <LeaderboardItem />
    <LeaderboardItem />
    <LeaderboardItem />
    <LeaderboardItem />
    <LeaderboardItem />
  </div>
</template>

<script>
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/vue';
import Avatar from '../../shared/components/Avatar';
import LeaderboardItem from './LeaderboardItem';

export default {
  name: 'Leaderboard',
  components: {
    LeaderboardItem,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    Avatar
  },
  data: () => {
    return {}
  },
};
</script>

<style lang="scss">
.leader-board {
  width: 1035px;
  display: flex;
  flex-direction: column;

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19px 14px 17px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: #848589;
  }
}
</style>