import { ApiClientStomp, EntityRequest, RewardsApiWs } from '@ziqni-tech/member-api-client';
import { reactive } from 'vue';

export const useGetRewards = () => {
  const rewards = reactive([]);

  const getEntityRewards = async (entityType, entityIds) => {
    const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

    const rewardRequest = EntityRequest.constructFromObject({
      entityFilter: [
        {
          entityType: entityType,
          entityIds: entityIds
        },
      ],
      skip: 0,
      limit: 3
    }, null);

    rewardsApiWsClient.getRewards(rewardRequest, (data) => {
      rewards.value = data.data;
    });
  }

  return {
    getEntityRewards,
    rewards
  }
}