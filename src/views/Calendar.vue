<template>
  <div class="text-center section">
    <h2 class="section-title pt-5">Calendar</h2>
    <calendar-view
        :items="competitions"
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
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
import '../../node_modules/vue-simple-calendar/dist/style.css';
import '../../node_modules/vue-simple-calendar/dist/css/default.css';
import '../../node_modules/vue-simple-calendar/dist/css/holidays-us.css';

const store = useStore();
const router = useRouter()

const competitions = ref([]);
const showDate = ref(new Date());
const displayPeriod = 'month';

const setShowDate = (d) => {
  showDate.value = d;
}
const getTournaments = async () => {
  try {
    const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
    const activeCompetitionRequest = CompetitionRequest.constructFromObject({
      competitionFilter: {
        statusCode: {
          moreThan: 10,
          lessThan: 100
        },
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        limit: 20,
        skip: 0
      }
    }, null);

    await competitionsApiWsClient.getCompetitions(activeCompetitionRequest, (res) => {
      competitions.value = res.data.map(item => {
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
    });
  } catch (error) {
    console.log('activeCompetitionRequest', error);
  }
}

getTournaments();

const clickEvent = (val) => {
  router.push({
    name: 'TournamentDetails',
    params: {
      id: val.id,
    },
  })
}

</script>

<style lang="scss" scoped>
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

.competition {
  font-size: 0.85em;

  &:hover {
    cursor: pointer;
  }

  &-active {
    background-color: #188A2A !important;
  }
  &-ready {
    background-color: #CE624B;
  }
  &-finalised {
    background-color: #727272;
  }
}
</style>