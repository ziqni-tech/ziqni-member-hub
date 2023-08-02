<template>
  <div class="table-container" :class="{'light-mode': !isDarkMode}">
    <div class="table-header" :class="{'light-mode': !isDarkMode}">
      <div class="rank">rank</div>
      <div>name</div>
      <div>Points</div>
      <div>Prize</div>
    </div>
    <div class="table-body">
      <div
          v-for="(leader, index) in leaders"
          :key="index"
          class="table-row"
          :class="{ 'active': isCurrentUser(leader) }"
      >
        <div class="rank" v-html="setPlace(leader.rank)"></div>
        <div class="name">
          <div class="members">
            <div v-for="member in leader?.members" :key="member.memberRefId" class="member">
              <img class="avatar" src="@/assets/images/user/avatar.png" alt="">
              <span class="member-name">{{ memberName(member) }}</span>
            </div>
          </div>
        </div>
        <div class="points">{{ leader.score }}</div>
        <div class="prize">{{ prize }}</div>
      </div>
    </div>
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
};

const memberName = (item) => {
  return item.memberRefId === member.value.memberRefId ? 'You' : item.name;
};

const setPlace = computed(() => (place) => {
  switch (place) {
    case 1:
      const firstPlaceSrc = require(`@/assets/icons/tournament/leaderboard/1st-place.png`);
      return `<img src="${ firstPlaceSrc }" alt="">`;
    case 2:
      const secondPlaceSrc = require(`@/assets/icons/tournament/leaderboard/2nd-place.png`);
      return `<img src="${ secondPlaceSrc }" alt="">`;
    case 3:
      const thirdPlaceSrc = require(`@/assets/icons/tournament/leaderboard/3d-place.png`);
      return `<img src="${ thirdPlaceSrc }" alt="">`;
    default:
      return `<span>${ place }</span>`;
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
  padding: 0 24px 35px 24px;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #262a3a;
  }

  .table-header {
    display: grid;
    grid-template-columns: 80px 1fr 0.5fr 0.2fr;
    font-family: $bold;
    font-size: 14px;
    line-height: 17px;
    padding: 15px;
    background-color: $main-bg-DM;
    text-align: left;
    color: rgba(255, 255, 255, 0.80);
    text-transform: capitalize;

    .rank {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.light-mode {
      background-color: white;
      color: #223241;
    }
  }

  .table-body {
    overflow-y: auto;
    padding: 6px;

    .table-row {
      display: grid;
      grid-template-columns: 80px minmax(100px, 1fr) 0.5fr 0.2fr;
      font-family: $medium;
      font-size: 12px;
      line-height: 16px;
      background-color: $card-bg-DM;
      align-items: center;
      padding: 8px 15px;
      border-radius: 10px;
      text-align: left;
      color: $text-color-white-LM;


      &:nth-child(even) {
        background-color: $main-bg-DM;
      }


      .members {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;

        .member {
          margin: 3px 0;
          display: flex;
          max-width: 100%;
          align-items: center;
          flex-wrap: nowrap;
        }
      }


      &.active {
        position: relative;
        background-color: $active-tab-bg_DM;
        box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50), 0 0 0 1px #406A8C;
        border-radius: 10px;
      }

      .rank {
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

      .members {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .member {
        margin: 3px 0;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .member-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

  }

  &.light-mode {
    .table-body {
      .table-row {
        display: grid;
        grid-template-columns: 80px minmax(100px, 1fr) 0.5fr 0.2fr;
        font-family: $medium;
        font-size: 12px;
        line-height: 16px;
        background-color: $card-bg-DM;
        align-items: center;
        padding: 8px 15px;
        border-radius: 10px;
        text-align: left;
        color: $nav-item-color-LM;


        &:nth-child(even) {
          background-color: $white-color-DM;
        }

        &:nth-child(odd) {
          background-color: $card-bg-LM;
        }


        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .member {
            margin: 3px 0;
            display: flex;
            max-width: 100%;
            align-items: center;
            flex-wrap: nowrap;
          }
        }


        &.active {
          position: relative;
          background-color: $info-item-bg;
          box-shadow: 0 2px 12px 0 rgba(236, 60, 198, 0.4), 0 0 0 1px #F7A1E4;
          border-radius: 10px;
        }

        .rank {
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

        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .member {
          margin: 3px 0;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;

          .member-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .table-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 690px;
    width: 100%;
    overflow-y: auto;
    padding: 0 12px 18px 12px;

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #262a3a;
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr 0.5fr 0.2fr;
      font-family: $bold;
      font-size: 10px;
      padding: 15px;
      background-color: $main-bg-DM;
      text-align: left;
      color: rgba(255, 255, 255, 0.80);

      .rank {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &.light-mode {
        background-color: white;
        color: $btn-prize-color-LM;
      }
    }

    .table-body {
      overflow-y: auto;
      padding: 6px;

      &::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #EDF3F7;
      }

      .table-row {
        display: grid;
        grid-template-columns: 70px minmax(100px, 1fr) 0.5fr 0.2fr;
        font-family: $medium;
        font-size: 10px;
        line-height: 16px;
        background-color: $card-bg-DM;
        align-items: center;
        padding: 8px 15px;
        border-radius: 10px;
        text-align: left;
        color: $white-color-DM;


        &:nth-child(even) {
          background-color: $main-bg-DM;
        }


        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          overflow: hidden;

          .member {
            margin: 3px 0;
            display: flex;
            max-width: 100%;
            align-items: center;
            flex-wrap: nowrap;
          }
        }


        &.active {
          position: relative;
          background-color: $active-tab-bg_DM;
          box-shadow: 0 2px 6px 0 rgba(64, 106, 140, 0.50), 0 0 0 1px #406A8C;
          border-radius: 10px;

        }

        .rank {
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

        .members {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .member {
          margin: 3px 0;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;

          .member-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    &.light-mode {
      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 70px minmax(100px, 1fr) 0.5fr 0.2fr;
          font-family: $medium;
          font-size: 12px;
          line-height: 16px;
          background-color: $card-bg-DM;
          align-items: center;
          padding: 8px 15px;
          border-radius: 10px;
          text-align: left;
          color: $nav-item-color-LM;


          &:nth-child(even) {
            background-color: $white-color-DM;
          }

          &:nth-child(odd) {
            background-color: $card-bg-LM;
          }


          .members {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .member {
              margin: 3px 0;
              display: flex;
              max-width: 100%;
              align-items: center;
              flex-wrap: nowrap;
            }
          }


          &.active {
            position: relative;
            background-color: $info-item-bg;
            box-shadow: 0 2px 6px 0 rgba(236, 60, 198, 0.4), 0 0 0 1px #F7A1E4;
            border-radius: 10px;
          }

          .rank {
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

          .members {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .member {
            margin: 3px 0;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .member-name {
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