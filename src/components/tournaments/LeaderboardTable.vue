<template>
  <div class="table-container">
    <table>
      <thead class="sticky-header">
        <tr>
          <th class="rank">rank</th>
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
          <td class="rank" v-html="setPlace(leader.rank)"></td>
          <td>
            <div class="members">
              <div v-for="member in leader?.members" class="member">
                <img class="avatar" src="@/assets/images/user/avatar.png" alt="">
                <span class="member-name">{{ memberName(member) }}</span>
              </div>
            </div>
          </td>
          <td>{{ leader.score }}</td>
          <td>{{ prize }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {logPlugin} from "@babel/preset-env/lib/debug";
const store = useStore();

const props = defineProps({
  leaders: Array,
  prize: Number
});

const member = computed(() => store.getters.getMember);

const isCurrentUser = (item) => {
  return item.members.some(m => m.memberRefId === member.value.memberRefId);
}

const memberName = (item) => {
  console.log('item:', item);
  console.log('member:', member.value);
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
@import '@/assets/scss/_variables';

.table-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 73%;
  width: 100%;
  overflow-y: auto;
  font-family: $semi-bold;

  &::-webkit-scrollbar {
    height: 5px;
    width: 0;
  }
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 3;
}

table {
  width: 100%;
  color: $text-color-white;

  td:first-child { border-top-left-radius: 10px; }
  td:first-child {  border-bottom-left-radius: 10px; }
  td:last-child { border-top-right-radius: 10px; }
  td:last-child { border-bottom-right-radius: 10px; }

  th {
    border: none;
    text-transform: capitalize;
    text-align: start;
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    padding-bottom: 15px;
  }

  th.rank {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
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
      font-size: 16px;
      line-height: 16px;

      &:nth-child(odd) {
        background-color: $light-grey;
      }
    }

    tr.active {
      background: #40748C;
      box-shadow: 0 2px 12px rgba(64, 106, 140, 0.5);
    }

    td {
      vertical-align: middle;
      text-align: start;
      padding: 8px 0;

      .members {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .member {
          margin: 3px 0;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;

          .member-name {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .rank {
      width: 100px;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
    }
  }
}
</style>