import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export const useCompetitions = () => {
  const competitions = ref([]);
  const totalRecords = ref(0);

  const getCompetitionsHandler = async (statusCode, limit, skip, ids) => {
    const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);

    const activeCompetitionRequest = CompetitionRequest.constructFromObject({
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

    await competitionsApiWsClient.getCompetitions(activeCompetitionRequest, (res) => {
      competitions.value = res.data;
      totalRecords.value = res.meta.totalRecordsFound;
    });
  }

  return {
    getCompetitionsHandler,
    competitions,
    totalRecords
  }
}