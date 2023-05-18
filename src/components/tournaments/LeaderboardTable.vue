<template>
  <div class="table-container">
    <table>
      <thead class="sticky-header">
      <tr>
        <th>rank</th>
        <th>name</th>
        <th>Points</th>
        <th>Prize</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(leader, index) in leaders"
          :key="index"
          :class="{ 'active': isCurrentUser(leader), 'sticky-row': index < 3 }"
      >
        <td class="rank" >
          {{leader.rank}}
        </td>
        <td>
        <span v-for="member in leader?.members">
            <img class="avatar" src="../../assets/images/user/avatar.png" alt="">
            {{ memberName(member) }}
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

const memberName = (item) => {
  return item.memberRefId === member.value.memberRefId ? 'You' : item.name;
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
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 73%;
  width: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    height: 5px;
    width: 0;
  }
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: $light-grey;
  z-index: 3;
}

table {
  width: 100%;
  color: $main-text-color-white;

  th {
    border: none;
    text-transform: capitalize;
    text-align: start;
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
    overflow: hidden;
    tr {
      display: table-row;
      height: auto;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;

      &:nth-child(even) {
        background-color: $light-grey;
      }

      td:first-child {
        border-left-style: solid;
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }
      td:last-child {
        border-right-style: solid;
        border-bottom-right-radius: $border-radius;
        border-top-right-radius: $border-radius;
      }
    }

    //tr.sticky-row {
    //  position: sticky;
    //  top: 40px;
    //}

    tr.active {
      background: #1d042d;
      box-shadow: 0 2px 12px rgba(64, 106, 140, 0.5);


      td:first-child {
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }

      td:last-child {
        overflow: hidden;
        border-bottom-right-radius: $border-radius;
        border-top-right-radius: $border-radius;
      }
    }

    td {
      vertical-align: middle;
      text-align: start;
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