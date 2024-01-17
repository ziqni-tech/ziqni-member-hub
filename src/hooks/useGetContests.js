import { ApiClientStomp, ContestRequest, ContestsApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export const useGetContests = () => {
  const contests = ref([]);

  const getEntityContests = async (compId) => {
    const contestApiWsClient = new ContestsApiWs(ApiClientStomp.instance);
    const contestRequest = ContestRequest.constructFromObject({
      contestFilter: {
        productIds: [],
        tags: [],
        startDate: null,
        endDate: null,
        ids: [],
        competitionIds: [compId],
        constraints: [],
        statusCode: {
          moreThan: 10,
          lessThan: 100
        },
      }
    }, null);

    await contestApiWsClient.getContests(contestRequest, (data) => {
      contests.value = data.data;
    })
  }

  return {
    contests,
    getEntityContests
  }
}