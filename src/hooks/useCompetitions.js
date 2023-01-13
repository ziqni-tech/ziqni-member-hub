import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export const useCompetitions = () => {
  const competitions = ref([]);
  const totalRecords = ref(0);
  const isLoading = ref(true);
  const isLoaded = ref(false)
  const error = ref(null);

  const getCompetitionsHandler = async (tournamentRequestData) => {
    const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
    const { statusCode, limit, skip, ids } = tournamentRequestData;

    const competitionRequest = CompetitionRequest.constructFromObject({
      competitionFilter: {
        statusCode,
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        limit,
        skip,
        ids
      }
    }, null);

    await competitionsApiWsClient.getCompetitions(competitionRequest, (res) => {
      if (res.errors?.length) {
        error.value = res.errors
      } else {
        competitions.value = res.data;
        totalRecords.value = res.meta.totalRecordsFound;
        isLoading.value = false;
        isLoaded.value = true;
      }

    });
  }

  return {
    getCompetitionsHandler,
    competitions,
    totalRecords,
    isLoading,
    isLoaded,
    error
  }
}