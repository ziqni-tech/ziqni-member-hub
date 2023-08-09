<template>
  <div class="section-title" :class="{'light-mode': !isDarkMode}">Tournaments bracket</div>
  <div class="connections-table" :class="{'light-mode': !isDarkMode}">
    <div v-if="roundsCount">
      <div class="connections-table_round-number">
<!--        <div v-for="(roundNumber) in roundsCount" :key="roundNumber" class="connections-table_round-label">-->
<!--          Round: {{ roundNumber }}-->
<!--        </div>-->
      </div>
      <div class="connections-table_rounds" ref="rounds">
        <div v-for="(roundNumber) in roundsCount" :key="roundNumber" class="connections-table_round">
          <div v-if="Object.keys(contestsByRounds[roundNumber]).length" class="connections-table_round-block">
            <div
                v-for="(item) in contestsByRounds[roundNumber]"
                :key="item.id"
                class="connections-table_round-item"
                :class="[{hasEntrants: item.entrantsFromContest && item.entrantsFromContest.length}, item.status.toLowerCase()]"
                :data-connect-id="item.id"
                @click="goToDetails(item)"
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
              />
<!--              <div-->
<!--                  class="action-btn"-->
<!--                  :class="{ 'leave': isEntrant(item) }"-->
<!--              >{{ 'Join' }}</div>-->
            </div>
          </div>
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
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';
import { useRoute, useRouter } from 'vue-router';
import TournamentDataRow from '@/components/tournaments/TournamentDataRow.vue';
import { useStore } from 'vuex';

const isReady = ref(false);
const isShowModal = ref(false);
const selectedId = ref(null);
const messageGeneral = ref('');
const modalTitle = ref('');
const contests = ref([]);
const contestsIds = ref([]);
const contestsEntrantsMap = ref({});
const roundsCount = ref(0);
const contestsByRounds = ref({});
const elementPairs = ref([]);

const store = useStore()
const route = useRoute();
const isDarkMode = computed(() => store.getters.getTheme);

const contestTimeLabel = (item) => {
  const { status } = item
  return status === 'Ready' ? 'Start' : 'End'
}

const contestTimeValue = (item) => {
  const { status,  scheduledStartDate, scheduledEndDate } = item
  return status === 'Ready' ? scheduledStartDate : scheduledEndDate
}

const isEntrant = (item) => {
  const entrantStatus = item.entrantStatus;
  return entrantStatus === 'Entrant' || entrantStatus === 'Entering';
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
    const ids = res.data.map(item => item.id);
    await getOptInStatus(ids);
    if (res.data.length) {
      roundsCount.value = res.data.reduce((max, current) => {
        return current.round > max ? current.round : max
      }, 0)
    }
    await setContestsByRounds()

  });
};

const getOptInStatus = async (ids) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Contest'],
      ids: ids,
      statusCodes: {
        gt: -5,
        lt: 40
      },
      skip: 0,
      limit: 20
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, res => {
    console.warn('optInStateRequest', optInStateRequest);
    console.warn('OPT RES', res);
    for (const contest of contests.value) {
      if (res.data.length) {
        const status = res.data.find(item => item.entityId === contest.id)?.status;
        // const percentage = res.data.find(item => item.entityId === contest.id)?.percentageComplete;

        contest.entrantStatus = status ? status : '';
        // contest.percentageComplete = percentage ? percentage : 0;
      } else {
        // contest.percentageComplete = 0;
        contest.entrantStatus = '';
      }
    }
    // console.warn('contests', contests.value);
    // achievementsData.value = achievements.value;

  });
};

const getItemDescription = (item) => {
  const status = item.status;
  const startDate = item.actualStartDate ?? item.scheduledStartDate;
  const endDate = item.actualEndDate ?? item.scheduledEndDate;
  const entrants = contestsEntrantsMap.value[item.id] ?? 0;

  const statusElement = '<h5>' + status + '</h5>';
  const startDateElement = `<p><b>Start Date: </b>${ startDate }</p>`;
  const endDateElement = `<p><b>End Date: </b>${ endDate }</p>`;
  const entrantsElement = `<p><b>Entrants: </b>${ entrants }</p>`;

  return (statusElement + startDateElement + endDateElement + entrantsElement);
};

const setContestsByRounds = () => {
  if (contests.value.length) {
    for (let i = 1; i <= roundsCount.value; i++) {
      contestsByRounds.value[i] = contests.value.filter(c => c.round === i);
    }
  }
  setElementPairs()
};
const setElementPairs = async () => {
  if (contests.value.length) {
    elementPairs.value = [];
    contests.value.forEach(c => {
      console.warn('C', c);
      if (c.entrantsFromContest && c.entrantsFromContest.length) {
        c.entrantsFromContest.forEach(e => elementPairs.value.push([c.id, e]));
      }
    });
    elementPairs.value = [...new Set(elementPairs.value)];
  }
  console.warn('elementPairs.value', elementPairs.value);
  sortContests();

  isReady.value = true;

  await nextTick(() => {
    drawConnectionLines();
  });
};

const sortContests = () => {
  let sorted = {};
  if (Object.keys(contestsByRounds.value).length && elementPairs.value.length) {
    sorted[roundsCount.value] = contestsByRounds.value[roundsCount.value];
    let tmp = contestsByRounds.value;
    for (let round = roundsCount.value - 1; round > 0; round--) {
      if (!sorted[round]) sorted[round] = [];
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

        contestsByRounds.value[round] = sorted[round];
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
      let firsPointCoordinates = { left: firsPoint.offsetLeft, top: firsPoint.offsetTop + 20 };
      let secondPoint = document.querySelector(`[data-connect-id="${ pair[1] }"]`);
      let secondPointCoordinates = { left: secondPoint.offsetLeft + 150, top: secondPoint.offsetTop + 20 };
      coordinatesArr.push([firsPointCoordinates, secondPointCoordinates, /*pair*/]);
    });
  }
  if (coordinatesArr.length) {
    coordinatesArr.forEach(c => drawLine(c[0].left, c[0].top, c[1].left, c[1].top, /*c[2]*/));
  }

};

const drawLine = (x1, y1, x2, y2, /*pair*/) => {
  // const contest = this.contests.find(c => c.id === pair[1]);
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
  let border = 'border-top: solid 1px #ddd';
  let lineClass = 'top-line';
  if (y1 > y2) {
    lineClass = 'bottom-line';
    y1 = y2;
    border = 'border-bottom: solid 1px #ddd';
  }

  // let description = '';
  // if (contest.description) {
  //   description = "<div class='bracket-description'>" + contest.description + "</div>";
  // }

  container.innerHTML += '<div class=\'bracket ' + lineClass + '\' style=\'width: ' + width + 'px; height: ' + height + 'px; ' + border + '; border-right: solid 1px #ddd; position: absolute; top: ' + y1 + 'px; left: ' + x1 + 'px;\'></div>';

};

const router = useRouter()

const goToDetails = (item) => {
  console.warn('item', item);
  router.push({
    name: 'TournamentDetails',
    params: {
      id: item.competitionId,
      contestId: item.id
    }
  });
}

</script>

<style scoped lang="scss">
@import "src/assets/scss/_variables";

.section-title {
  padding: 20px;
  color: #FFF;
  font-size: 24px;
  font-family: $bold;
  margin-bottom: 10px;
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
  padding-bottom: 150px;
  height: 100vh;
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

        &:hover {
          & + .connections-table_round-item-description {
            display: block;
          }
        }
      }

      &-actions {
        &:after {
          content: '\2807';
          font-size: 15px;
          cursor: pointer;
        }
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
          //background-color: #ddd;
        }
      }

      &.active {
        border-color: #6FCF97;
      }

      &.ready {
        border-color: #2F80ED;
      }

      &.finishing {
        border-color:  #F2994A;
      }

      &.finalised {
        background-color: #CCC; // #F2994A
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
  padding-bottom: 180px;

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

        &:hover {
          & + .connections-table_round-item-description {
            display: block;
          }
        }
      }

      &-actions {
        &:after {
          content: '\2807';
          font-size: 15px;
          cursor: pointer;
        }
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
          //background-color: #ddd;
        }
      }

      &.active {
        border-color: #6FCF97;
      }

      &.ready {
        border-color: #2F80ED;
      }

      &.finishing {
        border-color:  #F2994A;
      }

      &.finalised {
        background-color: #CCC; // #F2994A
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
</style>