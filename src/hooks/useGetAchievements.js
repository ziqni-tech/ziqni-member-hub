import { ref } from 'vue';
import { AchievementRequest, AchievementsApiWs, ApiClientStomp } from '@ziqni-tech/member-api-client';


export const useGetAchievements = () => {
  const achievements = ref([])

  const getAchievementsRequest = async () => {
    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

    const achievementsRequest = AchievementRequest.constructFromObject({
      achievementFilter: {
        productIds: [],
        ids: [],
        status: [],
        sortBy: [
          {
            queryField: 'created',
            order: 'Desc'
          },
        ],
        skip: 0,
        limit: 10,
        statusCode: {
          moreThan: 20,
          lessThan: 30
        },
        constraints: []
      },
    }, null);

    await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
      achievements.value = res.data;
    });
  }

  return {
    achievements,
    getAchievementsRequest
  }
}