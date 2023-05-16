<template>
  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th>rank</th>
        <th>name</th>
        <th>Points</th>
        <th>Prize</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(leader, index) in leaders" :key="index" :class="{ 'active': isCurrentUser(leader) }">
        <td class="rank" v-html="setPlace(leader.rank)"></td>
        <td>
        <span v-for="member in leader?.members">
            <img class="avatar" src="../../assets/images/user/avatar.png" alt="">
            {{ member.name }}
          </span>
        </td>
        <td>{{ leader.score }}</td>
        <td>2000</td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const props = defineProps({
  leaders: Array
});

const member = computed(() => store.getters.getMember);

const isCurrentUser = (item) => {
  return item.members.some(m => m.memberRefId === member.value.memberRefId);
}

const setPlace = computed(() => (place) => {
  switch (place) {
    case 1:
      const firstPlaceSrc = require(`@/assets/icons/tournament/leaderboard/1st-place.png`);
      return `<img src="${firstPlaceSrc}" alt="">`;
    case 2:
      const secondPlaceSrc = require(`@/assets/icons/tournament/leaderboard/2nd-place.png`);
      return `<img src="${secondPlaceSrc}" alt="">`;
    case 3:
      const thirdPlaceSrc = require(`@/assets/icons/tournament/leaderboard/3d-place.png`);
      return `<img src="${thirdPlaceSrc}" alt="">`;
    default:
      return `<span>${place}</span>`;
  }
});

</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  table tbody tr {
    border-radius: $border-radius !important;
  }
}

table {
  width: 100%;
  color: $main-text-color-white;

  th {
    border: none;
    text-transform: capitalize;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    padding-bottom: 15px;
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: $border-radius-round;
    margin-right: 6px;
  }

  tbody {
    height: auto;
    tr {
      display: table-row;
      height: auto;
      border-radius: $border-radius;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;

      &:nth-child(even) {
        background-color: $light-grey;
      }
    }

    tr.active {
      background: #2F0426;
      border: 1px solid #406A8C;
      box-shadow: 0 2px 12px rgba(64, 106, 140, 0.5);
      border-radius: 10px !important;
    }

    td {
      vertical-align: middle;
      text-align: center;
      padding: 8px 0;
    }

    .rank {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>