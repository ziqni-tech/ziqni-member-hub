<template>
  <div class="text-center calendar-section">
    <div class="spinner-container" v-if="!isLoaded">
      <CSpinner color="dark"/>
    </div>
    <calendar-view
        v-if="isLoaded"
        :items="competitions"
        :show-date="showDate"
        :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
        class="theme-default holiday-us-traditional"
        :class="isDarkMode ? 'darkMode' : 'lightMode'"
        :starting-day-of-week="1"
        :enable-drag-drop="false"
        :displayPeriodUom="displayPeriod"
        @click-item="clickEvent"
    >
      <template #header="{ headerProps }">
        <div class="cv-header">
          <div class="cv-header-nav">
            <div class="header-title">
              <div
                  class="go-back"
                  @click="$router.go(-1)"
              >
                <ArrowLeft :width="'30'" :height="'30'" :strokeColor="getIconStrokeColor()"/>
              </div>
              <div class="calendar-title">Competitions calendar</div>
              <div></div>
            </div>
            <div class="header-nav">
              <div class="currentPeriod">
                <button class="previousPeriod" @click="setShowDate(headerProps.previousPeriod)">&lt;</button>
                {{ headerProps.periodLabel }}
                <button class="nextPeriod" @click="setShowDate(headerProps.nextPeriod)">&gt;</button>
              </div>
              <div>
                <CFormSwitch reverse label="Week period:" id="formSwitchCheckDefault" @change="displayPeriodUpdate"
                             :checked="isWeekPeriod"/>
              </div>
            </div>
          </div>
        </div>
      </template>
    </calendar-view>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { CalendarView } from 'vue-simple-calendar';
import '../../../node_modules/vue-simple-calendar/dist/style.css';
import '../../../node_modules/vue-simple-calendar/dist/css/default.css';
import { useStore } from 'vuex';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import useMobileDevice from '@/hooks/useMobileDevice';

import { CFormSwitch } from '@coreui/vue';
import { CSpinner } from '@coreui/vue';
import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';

const router = useRouter();
const showDate = ref(new Date());
const displayPeriod = ref(null);
let isWeekPeriod = false;

displayPeriod.value = 'month';

const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);
const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

const { isMobile } = useMobileDevice();

const statusCode = {
  moreThan: 5,
  lessThan: 50
};
const limit = 20;

const competitions = ref([]);
const isLoaded = ref(false);

const setShowDate = (d) => {
  showDate.value = d;
};

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {};
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

onMounted(() => {
  getCompetitionsRequest();
});

const displayPeriodUpdate = () => {
  isWeekPeriod = !isWeekPeriod;
  if (isWeekPeriod) {
    displayPeriod.value = 'week';
  } else {
    displayPeriod.value = 'month';
  }
};

const getCompetitionsRequest = async () => {
  const competitionRequest = CompetitionRequest.constructFromObject({
    competitionFilter: {
      statusCode,
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      limit: 20,
      skip: 0,
      ids: []
    }
  }, null);

  try {
    const apiClientStomp = ApiClientStomp.instance;
    const competitionsApiWsClient = await new CompetitionsApiWs(apiClientStomp);

    let totalFetched = 0;
    let moreDataAvailable = true;

    while (moreDataAvailable) {
      competitionRequest.competitionFilter.skip = totalFetched;

      const response = await new Promise((resolve, reject) => {
        competitionsApiWsClient.getCompetitions(competitionRequest, resolve, reject);
      });
      const competitionsData = response.data;

      const mappedCompetitions = competitionsData.map(item => {
        let itemClass = '';
        switch (item.status) {
          case 'Active':
            itemClass = 'competition-active';
            break;
          case 'Ready':
            itemClass = 'competition-ready';
            break;
          case 'Finalised':
            itemClass = 'competition-finalised';
            break;
        }
        return {
          id: item.id,
          title: item.name,
          startDate: new Date(item.scheduledStartDate),
          endDate: new Date(item.scheduledEndDate),
          classes: ['competition', itemClass],
          status: item.status
        };
      });

      mappedCompetitions.sort((a, b) => {
        const statusOrder = ['Active', 'Ready', 'Finalised'];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });

      competitions.value = [...competitions.value, ...mappedCompetitions];

      totalFetched += competitionsData.length;

      if (totalFetched >= response.meta.totalRecordsFound || totalFetched >= limit.value) {
        moreDataAvailable = false;
      }
    }

    competitions.value.sort((a, b) => {
      const statusOrder = ['Active', 'Ready', 'Finalised'];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });

    isLoaded.value = true;
  } catch (e) {
    console.log('ERROR', e);
  }
};
const clickEvent = (val) => {
  router.push({
    name: 'TournamentDetails',
    params: {
      id: val.id,
    },
  });
};

</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

.calendar-section {
  padding: 20px;
}

.spinner-container {
  position: relative;
  width: 100%;
  height: 100vh;

  .spinner-border {
    position: absolute;
    top: 30%;
  }
}

.previousPeriod,
.nextPeriod {
  border: 1px solid $border-dark;
}

.cv-wrapper {
  height: 696px;
  width: 100%;
  max-height: 696px;
  min-height: 696px;
  border-radius: $border-radius;
  font-family: $semi-bold;

  .cv-header {
    border-radius: 20px 20px 0 0;

    .cv-header-nav {
      width: 100%;
      display: flex;
      flex-direction: column;

      .header-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 14px;

        .go-back {
          border-radius: $border-radius-sm;
          border: 1px solid $border-dark;
          //padding: 7px 12px;
          cursor: pointer;
        }

        .calendar-title {
          color: $text-color-white;
          font-size: 37px;
        }
      }

      .header-nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 0;

        .form-label.form-check-label {
          margin-bottom: 0;
          margin-top: 5px;
          color: #ffffff;
        }

        .form-check-input:checked {
          background-color: #8749DC;
          border-color: unset;
        }
      }

      .previousPeriod,
      .nextPeriod {
        border: 1px solid $border-dark;
      }

      .currentPeriod {
        font-size: 16px;
      }
    }

    .cv-header-nav {
      .previousYear,
      .previousPeriod,
      .currentPeriod,
      .nextPeriod,
      .nextYear {
        border-radius: 10px;
        margin-right: 3px;
        color: $text-color-white !important;
      }
    }
  }

  .cv-weeks {
    border-radius: 0 0 20px 20px;
  }

  .calendar-controls {
    margin-right: 1rem;
    min-width: 14rem;
    max-width: 14rem;
  }

  .calendar-parent {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 80vh;
  }

  .cv-wrapper.period-month.periodCount-2 .cv-week,
  .cv-wrapper.period-month.periodCount-3 .cv-week,
  .cv-wrapper.period-year .cv-week {
    min-height: 6rem;
  }
}

@media screen and (max-width: $tableWidth) {
  .calendar-title {
    font-size: 14px;
    margin-bottom: 15px;
    color: $text-color-white;
  }

  .cv-wrapper {
    height: 400px;
    width: 100%;
    max-height: 500px;
    min-height: 500px;
    border-radius: $border-radius;

    .cv-header {
      .cv-header-nav {
        .header-title {
          align-items: center;

          .calendar-title {
            color: $text-color-white;
            font-size: 16px;
            margin: 0;
          }

          .go-back {
            border-radius: $border-radius-sm;
            border: 1px solid $border-dark;
            //padding: 5px 10px;
            cursor: pointer;
          }
        }
      }
    }

    .cv-header {
      border-radius: 20px 20px 0 0;

      .periodLabel {
        display: none;
      }

      .currentWeekPeriod {
        display: flex;
        flex-direction: column;
        align-items: center;

        .switching-months {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .cv-header-nav {
        .previousYear,
        .previousPeriod,
        .currentPeriod,
        .nextPeriod,
        .nextYear {
          border-radius: 10px;
          margin-right: 3px;
        }
      }
    }

    .cv-weeks {
      border-radius: 0 0 20px 20px;
    }

    .calendar-controls {
      margin-right: 1rem;
      min-width: 10rem;
      max-width: 10rem;
    }

    .calendar-parent {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: hidden;
      max-height: 50vh;
    }

    .cv-wrapper.period-month.periodCount-2 .cv-week,
    .cv-wrapper.period-month.periodCount-3 .cv-week,
    .cv-wrapper.period-year .cv-week {
      min-height: 3rem;
    }
  }
}

@media screen and (max-width: 380px) {
  .cv-wrapper {
    .cv-header {
      .currentPeriod {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }

    }
  }
}

.cv-wrapper.darkMode {
  color: $body-text-color;

  .cv-header {
    background-color: $light-grey !important;
    border-radius: 20px 20px 0 0;
    color: $body-text-color;
    display: flex;
    flex-direction: row-reverse;

    .periodLabel {
      background-color: $light-grey !important;
      color: $text-color-white;
    }

    .cv-header-nav {
      background-color: $light-grey !important;


      .previousYear,
      .previousPeriod,
      .currentPeriod,
      .nextPeriod,
      .nextYear {
        color: $body-text-color;
        background-color: $light-grey;
      }
    }

    .cv-header-nav {
      .previousYear,
      .nextYear {
        display: none;
        color: $body-text-color;
        background-color: $light-grey;
      }
    }
  }

  .cv-header-days {
    background-color: $light-grey !important;

    .cv-header-day {
      background-color: $light-grey !important;
      font-size: 14px;
      font-family: $medium;
      padding: 12px 0;
    }
  }

  .cv-weekdays {
    .cv-day {
      background-color: $light-grey;
      font-size: 20px;
      font-family: $bold;

      .cv-day-number {
        color: $text-color-white;
      }
    }

    .today {
      background-color: #304F69 !important;
      border: 1px solid #223241 !important;
    }

    .outsideOfMonth {
      background-color: $light-grey !important;
    }
  }
}

.previousPeriod,
.nextPeriod.lightMode {
  border: 1px solid $main-border-color-LM;
}

.cv-wrapper.lightMode {
  color: black;

  .cv-weeks {
    border-color: $main-border-color-LM;
  }

  .cv-wrapper.period-month.periodCount-2 .cv-week,
  .cv-wrapper.period-month.periodCount-3 .cv-week,
  .cv-wrapper.period-year .cv-week {
    min-height: 6rem;
  }

  .cv-header {
    background-color: $card-bg-LM !important;

    .cv-header-nav {

      .header-nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 0;

        .form-label.form-check-label {
          margin-bottom: 0;
          margin-top: 5px;
          color: #080D12;
          font-family: $medium;
          font-size: 14px;
        }

        .form-check-input:checked {
          background-color: #8749DC;
          border-color: unset;
        }
      }

      .previousPeriod,
      .nextPeriod {
        border: 1px solid $main-border-color-LM;
        color: #080D12 !important;
        width: 30px;
        height: 30px;
        border-radius: 5px;
      }

      .currentPeriod {
        color: #080D12 !important;
        font-size: 12px;
        font-family: $medium;
      }
    }

    .cv-header-nav {
      .previousYear,
      .previousPeriod,
      .currentPeriod,
      .nextPeriod,
      .nextYear {
        color: black;
        background-color: $card-bg-LM;
      }
    }
  }

  .cv-header {
    .cv-header-nav {
      .header-title {
        align-items: center;

        .calendar-title {
          color: $section-title-color-LM;
          font-size: 20px;
          margin: 0;
          font-family: $bold;
        }

        .go-back {
          border-radius: $border-radius-sm;
          border: 1px solid $main-border-color-LM;
          //padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
  }

  .cv-header-days {
    border-color: $main-border-color-LM;

    .cv-header-day {
      border-color: $main-border-color-LM;
      background-color: #B9CEDF !important;
      font-size: 14px;
      font-family: $medium;
      padding: 12px 0;
      color: $btn-prize-color-LM;
    }
  }

  .cv-weekdays {
    border-color: $main-border-color-LM;

    .cv-day {
      border-color: $main-border-color-LM;
      background-color: $bg-body-LM !important;
      font-size: 20px;
      font-family: $bold;
    }

    .today {
      background-color: $pagination-active-btn-bg !important;
      border: 1px solid $main-border-color-LM !important;
    }

    .outsideOfMonth {
      background-color: $bg-secondary-LM !important;
    }
  }
}

.theme-default .cv-item.continued::before, .theme-default .cv-item.toBeContinued::after {
  display: none;
}

.theme-default .cv-item.continued, .theme-default .cv-item.toBeContinued {
  border-color: $border-dark;
}

.cv-header-days, .cv-header-day, .cv-weeks, .cv-week, .cv-day, .cv-item {
  border-color: $dark-blue;
}

.cv-wrapper.darkMode .cv-header {
  border-color: $dark-blue;
}

.cv-wrapper.darkMode .cv-header .cv-header-nav > button {
  border-color: $dark-blue;
}

.competition {
  font-size: 12px !important;
  cursor: pointer !important;
  color: #141E28;
  font-family: $bold;
  border: none;


  &-active {
    background-color: $active-tournament !important;
    color: #141E28
  }

  &-ready {
    background-color: $future-tournament !important;
    color: #141E28;
  }

  &-finalised {
    background-color: $finished-tournament !important;
    color: #CCC
  }
}

@media screen and (max-width: $tableWidth) {
  .competition {
    font-size: 0.55em !important;
    cursor: pointer !important;
    color: $body-text-color;

    &-active {
      background-color: $active-tournament !important;
    }

    &-ready {
      background-color: $future-tournament !important;
    }

    &-finalised {
      background-color: $finished-tournament !important;
    }
  }
}

</style>