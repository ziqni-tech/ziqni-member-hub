<template>
  <div class="text-center section">
    <h2 class="text-center calendar-title">Competitions calendar</h2>
    <calendar-view
      :items="competitionItems"
      :show-date="showDate"
      :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
      class="theme-default holiday-us-traditional"
      :class="isDarMode ? 'darkMode' : 'lightMode'"
      :starting-day-of-week="1"
      :enable-drag-drop="false"
      :displayPeriodUom="displayPeriod"
      @click-item="clickEvent"
    >
      <template #header="{ headerProps }">
        <calendar-view-header slot="header" :header-props="headerProps" @input="setShowDate" />
      </template>
    </calendar-view>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCompetitions } from '../../hooks/useCompetitions';

import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
import '../../../node_modules/vue-simple-calendar/dist/style.css';
import '../../../node_modules/vue-simple-calendar/dist/css/default.css';
import { useStore } from 'vuex';

const router = useRouter();
const showDate = ref(new Date());
const displayPeriod = 'month';
const { tournamentsResponse, getCompetitionsHandler } = useCompetitions();
const store = useStore();

// const isDarMode = computed(() => store.getters.getTheme)
const isDarMode = true

const statusCode = {
  moreThan: 15,
  lessThan: 35
}
const limit = 20

const setShowDate = (d) => {
  showDate.value = d;
}

getCompetitionsHandler({ statusCode, limit, skip: 0, ids: [] });

const competitionItems = ref([]);

watch(tournamentsResponse, (value) => {
  const competitions = value.data;
  competitionItems.value = competitions.map(item => {
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
    }
  })
})

const clickEvent = (val) => {
  router.push({
    name: 'TournamentDetails',
    params: {
      id: val.id,
    },
  })
}

</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

.calendar-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 15px;
}

.cv-wrapper {
  height: 696px;
  width: 100%;
  max-height: 696px;
  min-height: 696px;
  border-radius: $border-radius;

  .cv-header {
    border-radius: 20px 20px 0 0;

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

.cv-wrapper.darkMode {
  border: 1px solid $border-dark;
  color: $body-text-color;

  .cv-header {
    background-color: $light-grey !important;
    border-radius: 20px 20px 0 0;
    color: $body-text-color;

    .periodLabel {
      background-color: $light-grey !important;
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
  }

  .cv-header-days {
    background-color: $light-grey !important;
    .cv-header-day {
      background-color: $light-grey !important;
    }
  }

  .cv-weekdays {
    .cv-day {
      background-color: $light-grey;
    }
    .today {
      background-color: $today !important;
      border: 2px solid $blue !important;
    }
    .outsideOfMonth {
      background-color: $light-grey !important;
    }
  }
}
//.cv-wrapper.lightMode {
//  border: 1px solid $border-header-light-mode;
//  color: black;
//
//  .cv-wrapper.period-month.periodCount-2 .cv-week,
//  .cv-wrapper.period-month.periodCount-3 .cv-week,
//  .cv-wrapper.period-year .cv-week {
//    min-height: 6rem;
//  }
//
//  .cv-header {
//    background-color: $primary-bg !important;
//
//    .cv-header-nav {
//      .previousYear,
//      .previousPeriod,
//      .currentPeriod,
//      .nextPeriod,
//      .nextYear {
//        color: black;
//        background-color: $primary-bg;
//      }
//    }
//  }
//
//  .cv-header-days {
//    .cv-header-day {
//      background-color: $primary-bg !important;
//    }
//  }
//
//  .cv-weekdays {
//    .cv-day {
//      background-color: $primary-bg !important;
//    }
//    .today {
//      background-color: $light-blue !important;
//      border: 2px solid $border-header-light-mode !important;
//    }
//    .outsideOfMonth {
//      background-color: $primary-bg-dark-LM  !important;
//    }
//  }
//}
.theme-default .cv-item.continued::before, .theme-default .cv-item.toBeContinued::after {
  color: $purple;
  margin: 0 3px;
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
  font-size: 0.85em !important;
  cursor: pointer !important;
  color: $body-text-color;

  &-active {
    background-color: $active-tournament  !important;
  }
  &-ready {
    background-color: $future-tournament !important;
  }
  &-finalised {
    background-color: $finished-tournament !important;
  }
}
</style>