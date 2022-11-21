import { ApiClientStomp, LeaderboardApiWs, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export default async function useConnect() {
  const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5X2lkIjoiSEZEYmhJUUI3UUctTWpNa3dPQTIiLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiNDUyNzc2NzIyODQ5NTI5NSIsImFjY291bnRfaWQiOiJWb1lvdlh3Qm42OWk2elVjSVBBYyIsInNwYWNlX25hbWUiOiJ0ZXN0LXNwYWNlLTEiLCJuYW1lIjoiQ2FybWluZSBMLiIsIm1lbWJlcl90eXBlIjoiSW5kaXZpZHVhbCIsIm1lbWJlcl9pZCI6IlhvTnhjb1FCeTZhenVmT1RNdzhWIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWdhcGkiOnsicm9sZXMiOlsiUHVibGljIiwiTWVtYmVyIiwiVmlld0FjaGlldmVtZW50cyIsIlZpZXdBd2FyZHMiLCJDbGFpbUF3YXJkcyIsIlZpZXdDb21wZXRpdGlvbnMiLCJWaWV3Q29udGVzdHMiLCJWaWV3RmlsZXMiLCJWaWV3TWVtYmVycyIsIk1lbWJlcnNPcHRpbiIsIlZpZXdNZXNzYWdlcyIsIkNvbm5lY3RQcm94eSIsIlZpZXdSZXdhcmRzIiwiVmlld1J1bGVzIl19fSwic3ViIjoiWG9OeGNvUUJ5NmF6dWZPVE13OFYiLCJqdGkiOiI5YTlkZGQ2OS04NmY4LTQ2NjEtYWJkMS02MjQ1MjhkYWYzNTYiLCJpYXQiOjE2Njg3NzY2MzQsImV4cCI6MTY3MDkzNjYzNH0.2YfBoMPIM2JQF0xGU6LaikTZd8Uu2DVA3EC6Gw3qlx0';
  const apiClientStomp = ApiClientStomp.instance;
  const connected = ref(false);
  const memberData = ref({});

  await apiClientStomp.connect({ token: authToken });
  connected.value = true;


  const memberApiWsClient = await new MembersApiWs(apiClientStomp);
  const memberRequest = MemberRequest.constructFromObject(
    {
      'includeFields': [],
      'includeCustomFields': [],
      'includeMetaDataFields': []
    },
    null);

  memberApiWsClient.getMember(memberRequest, async (data) => {
    memberData.value = await data.data;
  })

  const apiLeaderboardWsClient = new LeaderboardApiWs(apiClientStomp);
  const leaderboardSubscriptionRequest = {
    action: 'Subscribe',
    entityId: 'n38yUoQBSPM0WYwFnk1B',
    leaderboardFilter: {
      // ranksAboveToInclude: 1,
      // ranksBelowToInclude: 20,
      // topRanksToInclude: 20
    }
  };
  apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (data) => {
    console.log('LEADERBOARD', data);
  });

  return { apiClientStomp, memberData };
}