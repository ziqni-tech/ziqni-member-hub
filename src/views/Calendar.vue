<template>
  <div class="text-center section">
    <h2 class="section-title pt-5">Calendar</h2>
    <calendar-view
      :items="competitionItems"
      :show-date="showDate"
      :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
      class="theme-default holiday-us-traditional "
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCompetitions } from '../hooks/useCompetitions';

import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
import '../../node_modules/vue-simple-calendar/dist/style.css';
import '../../node_modules/vue-simple-calendar/dist/css/default.css';
import { useStore } from 'vuex';

const router = useRouter();
const showDate = ref(new Date());
const displayPeriod = 'month';
const { tournamentsResponse, getCompetitionsHandler } = useCompetitions();
const store = useStore();

const statusCode = {
  moreThan: 5,
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
@import "../assets/scss/utils/vars";
.cv-wrapper {
  height: 696px;
  width: 100%;
  max-height: 696px;
  min-height: 696px;
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
  background-color: white;
}
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}

.cv-header {
  background-color: $primary-bg !important;
  .cv-header-nav {
    .previousYear,
    .previousPeriod,
    .currentPeriod,
    .nextPeriod,
    .nextYear {
      background-color: $primary-bg !important;
    }

  }
}
.cv-header-days {
  .cv-header-day {
    background-color: $primary-bg !important;
  }
}
.cv-weekdays {
  .cv-day {
    background-color: #FFFFFF !important;
  }
  .today {
    background-color: $primary-bg !important;
    border: 2px solid $border-base !important;
    box-sizing: border-box !important;
  }
  .outsideOfMonth {
    background-color: $sts-grey-lightest !important;
  }
}

.competition {
  font-size: 0.85em !important;
  cursor: pointer !important;

  &-active {
    background-color: $sts-green-light  !important;
  }
  &-ready {
    background-color: $sts-red-light !important;
  }
  &-finalised {
    background-color: $sts-grey-light !important;
  }
}
</style>