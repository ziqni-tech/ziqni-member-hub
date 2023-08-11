<template>
  <div class="tournaments-bracket">
    <div class="section-title" :class="{'light-mode': !isDarkMode}">
      <span>Tournaments bracket</span>
      <div v-if="isMobilePhone" class="info-btn" @click="showInfoHandler">
        <InfoCircle :strokeColor="getIconStrokeColor()" :width="'15'" :height="'15'"/>
        <div class="info" :class="{'show-info': isShowInfo}">
          <div class="info-item" v-for="item in infoItems">
            <div class="dot" :style="{ backgroundColor: item.color }"></div>
            <span class="info-item_title">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="connections-table" :class="{'light-mode': !isDarkMode}" >
      <div v-if="roundsCount">
        <div class="connections-table_round-number">
          <!--        <div v-for="(roundNumber) in roundsCount" :key="roundNumber" class="connections-table_round-label">-->
          <!--          Round: {{ roundNumber }}-->
          <!--        </div>-->
        </div>
        <div class="connections-table_rounds" ref="rounds" @click="handleActions($event)">
          <div v-for="(roundNumber) in roundsCount" :key="roundNumber" class="connections-table_round" @click="() => console.log(`click ${roundNumber}`)">
            <div v-if="Object.keys(contestsByRounds[roundNumber]).length" class="connections-table_round-block">
              <div
                  v-for="(item) in contestsByRounds[roundNumber]"
                  :key="item.id"
                  class="connections-table_round-item"
                  :class="[{hasEntrants: item.entrantsFromContest && item.entrantsFromContest.length}, item.status.toLowerCase()]"
                  :data-connect-id="item.id"
              >
                <div :data-contest-id="item.id" class="connections-table_round-item-name">
                  {{ item.name }}
                </div>
                <TournamentDataRow
                    :label="contestTimeLabel(item)"
                    :value="contestTimeValue(item)"
                    :is-date="true"
                    :is-dark-mode="isDarkMode"
                    :is-seconds-show="false"
                    :is-mobile-flex-column="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-message" :class="{'light-mode': !isDarkMode}">This competition has no contests</div>
    </div>
    <div v-if="!isMobilePhone" class="tournaments-bracket-footer" :class="{'light-mode': !isDarkMode}">
      <div class="inner-wrapper">
        <div class="footer-info-item" v-for="item in infoItems">
          <div class="dot" :style="{ backgroundColor: item.color }"></div>
          <span class="info-item_title">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import {
  ApiClientStomp,
  ContestRequest,
  ContestsApiWs,

} from '@ziqni-tech/member-api-client';
import { useRoute, useRouter } from 'vue-router';
import TournamentDataRow from '@/components/tournaments/TournamentDataRow.vue';
import { useStore } from 'vuex';
import InfoCircle from '@/shared/components/svg-icons/InfoCircle.vue';
import useMobilePhoneDevice from '@/hooks/useMobilePhoneDevice';
import { deepClone } from '@/utils/deepClone';

const isReady = ref(false);
const contests = ref([]);
const roundsCount = ref(0);
const contestsByRounds = ref({});
const elementPairs = ref([]);
const isShowInfo = ref(false);

const store = useStore();
const route = useRoute();
const router = useRouter();
const isDarkMode = computed(() => store.getters.getTheme);

const showInfoHandler = () => {
  isShowInfo.value = !isShowInfo.value;
};

const { isMobilePhone } = useMobilePhoneDevice();
const infoItems = [
  { name: 'ready', title: 'Ready', color: '#2F80ED' },
  { name: 'active', title: 'Active', color: '#6FCF97' },
  { name: 'finishing', title: 'Finishing', color: '#F2994A' },
  { name: 'finalised', title: 'Finalised', color: '#CCC' },
  { name: 'cancelled', title: 'Cancelled', color: '#666' },
];

const handleActions = (event) => {
  const clickedElement = event.target
  const closestElement = clickedElement.closest('[data-connect-id]')

  if (closestElement) {
    const contestId = closestElement.getAttribute('data-connect-id')

    router.push({
      name: 'TournamentDetails',
      params: {
        id: route.params.id,
        contestId: contestId
      }
    });
  }
}


const contestTimeLabel = (item) => {
  const { status } = item;
  return status === 'Ready' ? 'Start' : 'End';
};

const contestTimeValue = (item) => {
  const { status, scheduledStartDate, scheduledEndDate } = item;
  return status === 'Ready' ? scheduledStartDate : scheduledEndDate;
};

onMounted(() => {
  getEntityContests();
});

const getEntityContests = async () => {
  const contestApiWsClient = new ContestsApiWs(ApiClientStomp.instance);
  const contestRequest = ContestRequest.constructFromObject({
    contestFilter: {
      productIds: [],
      tags: [],
      startDate: null,
      endDate: null,
      ids: [],
      competitionIds: [route.params.id],
      constraints: [],
      statusCode: {
        moreThan: 5,
        lessThan: 100
      },
      limit: 20
    }
  }, null);

  await contestApiWsClient.getContests(contestRequest, async (res) => {
    contests.value = res.data;

    if (res.data.length) {
      roundsCount.value = res.data.reduce((max, current) => {
        return current.round > max ? current.round : max;
      }, 0);
    }
    await setContestsByRounds();

  });
};

const setContestsByRounds = () => {
  if (contests.value.length) {
    for (let i = 1; i <= roundsCount.value; i++) {
      contestsByRounds.value[i] = contests.value.filter(c => c.round === i);
    }
  }
  setElementPairs();
};
const setElementPairs = async () => {
  if (contests.value.length) {
    elementPairs.value = [];
    contests.value.forEach(c => {
      if (c.entrantsFromContest && c.entrantsFromContest.length) {
        c.entrantsFromContest.forEach(e => elementPairs.value.push([c.id, e]));
      }
    });
    elementPairs.value = [...new Set(elementPairs.value)];
  }

  sortContests();

  isReady.value = true;

  await nextTick(() => {
    drawConnectionLines();
  });
};


const sortContests = () => {
  let sorted = {};
  if (Object.keys(contestsByRounds.value).length && elementPairs.value.length) {
    sorted[roundsCount.value] = deepClone(contestsByRounds.value[roundsCount.value]);
    let tmp = deepClone(contestsByRounds.value);
    for (let round = roundsCount.value - 1; round > 0; round--) {
      if (!sorted[round]) sorted[round] = deepClone([]);
      contestsByRounds.value[round + 1].forEach(contest => {
        if (contest.entrantsFromContest && contest.entrantsFromContest.length) {
          contest.entrantsFromContest.forEach(entrant => {
            let idx = tmp[round].findIndex(c => c.id === entrant);
            if (idx !== -1) {
              let el = tmp[round].splice(idx, 1);
              sorted[round].push(el[0]);
            }
          });
        }

        contestsByRounds.value[round] = deepClone(sorted[round]);
      });
    }

    for (let round = 1; round < roundsCount.value; round++) {
      if (tmp[round] && tmp[round].length) {
        tmp[round].forEach(c => {
          contestsByRounds.value[round].push(c);
        });
      }
    }
  }
};

const drawConnectionLines = () => {
  let coordinatesArr = [];
  if (elementPairs.value.length) {
    elementPairs.value.forEach(pair => {
      let firsPoint = document.querySelector(`[data-connect-id="${ pair[0] }"]`);
      let firsPointCoordinates = { left: firsPoint.offsetLeft - 10, top: firsPoint.offsetTop + 30 };

      let secondPoint = document.querySelector(`[data-connect-id="${ pair[1] }"]`);
      let secondPointCoordinates = { left: secondPoint.offsetLeft + 140, top: secondPoint.offsetTop + 30 };

      coordinatesArr.push([firsPointCoordinates, secondPointCoordinates, /*pair*/]);
    });
  }
  if (coordinatesArr.length) {
    coordinatesArr.forEach(c => drawLine(c[0].left, c[0].top, c[1].left, c[1].top, /*c[2]*/));
  }
};

const drawLine = (x1, y1, x2, y2) => {
  if (x2 < x1) {
    let tmp;
    tmp = x2;
    x2 = x1;
    x1 = tmp;
    tmp = y2;
    y2 = y1;
    y1 = tmp;
  }
  let container = document.querySelector('.connections-table_rounds');
  let width = Math.abs(x2 - x1) / 2;
  let height = Math.abs(y2 - y1);

  let border = `border-top: solid 1px #96B5CF`;
  let lineClass = 'top-line';
  if (y1 > y2) {
    lineClass = 'bottom-line';
    y1 = y2;
    border = `border-bottom: solid 1px #96B5CF`;
  }

  container.innerHTML += '<div class=\'bracket ' + lineClass + '\' style=\'width: ' + width + 'px; height: ' + height + 'px; ' + border + '; border-right: solid 1px #96B5CF; position: absolute; top: ' + y1 + 'px; left: ' + x1 + 'px;\'></div>';
};

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

</script>

<style scoped lang="scss">
@import "src/assets/scss/_variables";

.empty-message {
  color: #FFF;
  font-size: 20px;
  font-family: $medium;
  margin-top: 100px;
}

.empty-message.light-mode {
  color: #080D12;
  font-size: 20px;
  font-family: $medium;
  margin-top: 100px;
}

.tournaments-bracket {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
}

.section-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  color: #FFF;
  font-size: 24px;
  font-family: $bold;
  margin-bottom: 10px;
}

.tournaments-bracket-footer {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  .inner-wrapper {
    border-top: 1px solid #B9CEDF;
    margin: 0 66px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .footer-info-item {
      display: flex;
      align-items: center;
      margin-right: 30px;

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 4px;
      }

      .info-item_title {
        font-size: 12px;
        font-family: $mainFont;
        color: #FFFFFF;
      }
    }
  }


  &.light-mode {
    .footer-info-item {
      display: flex;
      align-items: center;
      margin-right: 30px;

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 4px;
      }

      .info-item_title {
        font-size: 12px;
        font-family: $mainFont;
        color: #080D12;
      }
    }
  }
}

.section-title.light-mode {
  padding: 20px;
  color: #080D12;
  font-size: 24px;
  font-family: $bold;
}

.card-body {
  overflow: auto;
}

.connections-table {
  width: 100%;
  height: 75vh;
  padding-top: 20px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  &_rounds {
    display: flex;
    position: relative;
  }

  &_round {
    &-number {
      display: flex;
    }

    &-item {
      width: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 5px;
      padding: 9px 10px;
      margin: 0 44px 25px;
      border: 1px solid;
      background-color: $secondary-bg-DM;
      position: relative;
      cursor: pointer;

      .action-btn {
        width: 100%;
        display: flex;
        padding: 5px;
        justify-content: center;
        align-items: center;
        border: 1px solid #EE3EC8;
        border-radius: 10px;

        font-size: 12px;
        font-family: $bold;
        text-transform: capitalize;

        margin-top: 10px;
      }

      &-name {
        width: 100%;
        font-size: 14px;
        font-family: $bold;
        color: #FFF;
      }

      &.hasEntrants {
        &:before {
          content: '';
          display: block;
          position: absolute;
          left: -50px;
          top: 29px;
          width: 48px;
          height: 1px;
          background-color: #96B5CF;
        }
      }

      &.active {
        border-color: #6FCF97;
      }

      &.ready {
        border-color: #2F80ED;
      }

      &.finishing {
        border-color: #F2994A;
      }

      &.finalised {
        background-color: #CCC;
      }

      &.cancelled {
        border-color: #666;
      }
    }

    &-block {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
    }
  }
}

.connections-table.light-mode {

  &_rounds {
    display: flex;
    position: relative;
  }

  .connections-table_round {
    &-number {
      display: flex;
    }

    .connections-table_round-item {
      width: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 5px;
      padding: 9px 10px;
      margin: 0 44px 25px;
      border: 1px solid;
      background-color: $bg-secondary-LM;

      .action-btn {
        width: 100%;
        display: flex;
        padding: 5px;
        justify-content: center;
        align-items: center;
        border: 1px solid #EE3EC8;
        border-radius: 10px;

        font-size: 12px;
        font-family: $bold;
        text-transform: capitalize;
        color: $white-color-DM;
        margin-top: 10px;
        background: $btn-primary-bg-color-LM;
      }

      .leave {
        border: 1px solid $btn-border-color-LM;
        background: none;
        color: $white-color-DM;
      }

      &-name {
        width: 100%;
        font-size: 14px;
        font-family: $bold;
        color: #080D12;
      }

      &.hasEntrants {
        &:before {
          content: '';
          display: block;
          position: absolute;
          left: -50px;
          top: 29px;
          width: 48px;
          height: 1px;
          background-color: #96B5CF;
        }
      }

      &.active {
        border-color: #6FCF97;
      }

      &.ready {
        border-color: #2F80ED;
      }

      &.finishing {
        border-color: #F2994A;
      }

      &.finalised {
        background-color: #CCC;
      }

      &.cancelled {
        border-color: #666;
      }
    }

    &-block {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
    }
  }
}

@media screen and (max-width: 450px) {
  .section-title {
    padding: 10px 0;
    color: #FFF;
    font-size: 14px;
    font-family: $bold;
    margin-bottom: 10px;

    .info-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: 1px solid rgba(230, 230, 230, 0.20);
      position: relative;

      .info.show-info {
        display: flex;
      }

      .info {
        display: none;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        font-size: 10px;
        font-family: $mainFont;
        background-color: $modal-bg-DM;
        border-radius: 5px;
        position: absolute;
        bottom: -105px;
        right: 0;
        z-index: 5;

        .info-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
            margin-right: 4px;
          }

          .info-item_title {
            color: #FFF;
          }
        }
      }
    }
  }

  .info.show-info {
    display: flex;
  }

  .section-title.light-mode {
    color: #080D12;
    font-size: 14px;
    padding: 10px 0;

    .info-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: 1px solid #B9CEDF;

      .info.show-info {
        display: flex;
      }

      .info {
        display: none;
        flex-direction: column;
        align-items: flex-start;
        background-color: #DCE6EF;
        border-radius: 5px;
        position: absolute;
        bottom: -105px;
        right: 0;
        z-index: 5;

        .info-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          .dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
          }

          .info-item_title {
            color: $btn-secondary-color-LM;
          }
        }
      }
    }
  }

  .connections-table {
    padding-bottom: 0;
    height: 70vh;
    padding-top: 0;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    &::-webkit-scrollbar-thumb {
      width: 0;
      border-radius: 3px;
    }

    &_rounds {
      display: flex;
      position: relative;
    }

    &_round {
      &-number {
        display: flex;
      }

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 5px;
        padding: 9px 10px;
        margin: 0 44px 9px 0;
        border: 1px solid;
        background-color: $secondary-bg-DM;

        .action-btn {
          width: 100%;
          display: flex;
          padding: 5px;
          justify-content: center;
          align-items: center;
          border: 1px solid #EE3EC8;
          border-radius: 10px;

          font-size: 12px;
          font-family: $bold;
          text-transform: capitalize;

          margin-top: 10px;
        }

        &-name {
          width: 100%;
          font-size: 14px;
          font-family: $bold;
          color: #FFF;
        }

        &.hasEntrants {
          &:before {
            content: '';
            display: block;
            position: absolute;
            left: -28px;
            top: 29px;
            width: 27px;
            height: 1px;
          }
        }

        &.active {
          border-color: #6FCF97;
        }

        &.ready {
          border-color: #2F80ED;
        }

        &.finishing {
          border-color: #F2994A;
        }

        &.finalised {
          background-color: #CCC;
        }

        &.cancelled {
          border-color: #666;
        }
      }

      &-block {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
      }
    }
  }

  .connections-table.light-mode {
    padding-bottom: 0;
    height: 70vh;
    padding-top: 0;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    &_rounds {
      display: flex;
      position: relative;
    }

    .connections-table_round {
      &-number {
        display: flex;
      }

      .connections-table_round-item {
        padding: 9px 10px;
        margin: 0 44px 9px 0;
        border: 1px solid;

        .action-btn {
          width: 100%;
          display: flex;
          padding: 5px;
          justify-content: center;
          align-items: center;
          border: 1px solid #EE3EC8;
          border-radius: 10px;

          font-size: 12px;
          font-family: $bold;
          text-transform: capitalize;

          margin-top: 10px;
        }

        .connections-table_round-item-name {
          width: 100%;
          font-size: 14px;
          font-family: $bold;
          color: #080D12;
        }

        &.hasEntrants {
          &:before {
            content: '';
            display: block;
            position: absolute;
            left: -25px;
            top: 20px;
            width: 25px;
            height: 1px;
          }
        }

        &.active {
          border-color: #6FCF97;
        }

        &.ready {
          border-color: #2F80ED;
        }

        &.finishing {
          border-color: #F2994A;
        }

        &.finalised {
          background-color: #CCC;
        }

        &.cancelled {
          border-color: #666;
        }
      }

      &-block {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
      }
    }
  }
}
</style>