import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import { reactive } from 'vue';
import { useStore } from 'vuex';

const useCompetitions = async () => {
  const store = useStore();
  const competitions = reactive([]);

  try {
    const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
    const activeCompetitionRequest = CompetitionRequest.constructFromObject({
      competitionFilter: {
        statusCode: {
          moreThan: 10,
          lessThan: 35
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
      competitions.value = res.data;
      store.dispatch('setCurrentCompetitionsAction', res.data);

    });
  } catch (error) {
    console.log('activeCompetitionRequest', error);
  }

  return { competitions }
}

export default useCompetitions;