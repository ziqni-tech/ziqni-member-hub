import { reactive } from 'vue';
import { ApiClientStomp, AwardRequest, AwardsApiWs } from '@ziqni-tech/member-api-client';


export const useGetAwards = () => {
  const awards = reactive([]);

  const getAvailableAwards = async function (entityIds) {
    const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

    const awardRequest = AwardRequest.constructFromObject({
      awardFilter: {
        entityIds: entityIds,
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        skip: 0,
        limit: 10
      }
    });

    await awardsApiWsClient.getAwards(awardRequest, (res) => {
      awards.value = res.data;
    });
  };

  return {
    awards,
    getAvailableAwards
  }
}