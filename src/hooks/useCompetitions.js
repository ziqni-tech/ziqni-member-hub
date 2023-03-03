import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export const useCompetitions = () => {
  const tournamentsResponse = ref(null)

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
      tournamentsResponse.value = res;
    });
  }

  return {
    getCompetitionsHandler,
    tournamentsResponse
  }
}