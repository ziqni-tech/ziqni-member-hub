import { ref } from 'vue';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';

export const useSubscribeMember = async () => {
  const member = ref({});
  const isReady = ref(false);

  const memberApiWsClient = await new MembersApiWs(ApiClientStomp.instance);
  const memberRequest = MemberRequest.constructFromObject(
    {
      'includeFields': [],
      'includeCustomFields': [],
      'includeMetaDataFields': []
    },
    null);

  memberApiWsClient.getMember(memberRequest, async (data) => {
    member.value = await data.data;
    isReady.value = true;
    });


  return {
    member,
    isReady
  };
};