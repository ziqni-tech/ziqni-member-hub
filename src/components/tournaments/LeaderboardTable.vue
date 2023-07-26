<template>
  <div class="table-container" :class="{'light-mode': !isDarkMode}">
    <table :class="{'light-mode': !isDarkMode}">
      <thead class="sticky-header" :class="{'light-mode': !isDarkMode}">
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
const store = useStore();

const props = defineProps({
  leaders: Array,
  prize: Number,
  isDarkMode: Boolean
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
@import '@/assets/scss/_variables';

.table-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 690px;
  width: 100%;
  overflow-y: auto;
  //font-family: $semi-bold;
  padding: 0 24px 14px 24px;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #262a3a;
  }
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 3;
  //background-color: $dark-grey;

  &.light-mode {
    //background-color: white;
  }
}

table {
  width: 100%;
  color: $white-color-DM;

  td:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  td:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  th {
    border: none;
    text-transform: capitalize;
    text-align: start;
    font-family: $bold;
    font-size: 16px;
    line-height: 17px;
    padding-bottom: 15px;
    padding-top: 15px;
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
      font-family: $medium;
      font-size: 12px;
      line-height: 16px;

      &:nth-child(odd) {
        background-color: $card-bg-DM;
      }
    }

    tr {
      border-radius: 10px;
    }

    tr.active {
      background: $active-tab-bg_DM;
      border-radius: 10px;
      position: relative;
      box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50), 0 0 0 1px #406A8C;
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

  &.light-mode {
    width: 100%;
    color: $card-text-color-LM;

    td:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    td:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    th {
      border: none;
      text-transform: capitalize;
      text-align: start;
      font-family: $bold;
      font-size: 14px;
      line-height: 17px;
      padding-bottom: 15px;
      padding-top: 15px;
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
      color: $card-title-color-LM;

      tr {
        display: table-row;
        height: auto;
        font-family: $medium;
        font-size: 12px;
        line-height: 16px;

        &:nth-child(odd) {
          background-color: $card-bg-LM;
        }
      }

      tr.active {
        border-radius: 10px;
        position: relative;
        box-shadow: 0 2px 12px 0 rgba(236, 60, 198, 0.4), 0 0 0 1px #F7A1E4;
        background: $info-item-bg;
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
}
@media screen and (max-width: 1255px) {
  table {
    width: 100%;
    color: $text-color-white;
    tbody {
      td {
        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 250px;
          padding-right: 5px;

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
              width: 100%;
              max-width: 250px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: $tableWidth) {
  .table-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    font-family: $bold;
    padding: 0 10px 14px 10px;

    &::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #262a3a;
    }

    &.light-mode {

    }
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 3;
    background-color: $dark-grey;
  }

  table {
    width: 100%;
    color: $text-color-white;

    th {
      border: none;
      text-transform: capitalize;
      text-align: start;
      font-size: 16px;
      padding-bottom: 10px;
      padding-top: 10px;
    }

    th.rank {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar {
      width: 20px;
      height: 20px;
      border-radius: $border-radius-round;
      margin-right: 6px;
    }

    tbody {
      td {

        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 500px;

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
              width: 100%;
              //max-width: 80px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

    }
  }
}

@media screen and (max-width: 640px) {
  table {
    width: 100%;
    color: $text-color-white;
    tbody {
      td {
        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 300px;
          padding-right: 5px;

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
              width: 100%;
              max-width: 300px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 530px) {
  table {
    width: 100%;
    color: $text-color-white;
    tbody {
      td {
        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 300px;
          padding-right: 5px;

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
              width: 100%;
              max-width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 440px) {
  table {
    width: 100%;
    color: $text-color-white;
    tbody {
      td {
        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 300px;
          padding-right: 5px;

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
              width: 100%;
              max-width: 120px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>