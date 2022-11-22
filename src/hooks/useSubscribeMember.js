import { ref } from 'vue';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';

const useSubscribeMember = () => {
  const member = ref({});

  try {
    const memberApiWsClient = new MembersApiWs(ApiClientStomp.instance);
    const memberRequest = MemberRequest.constructFromObject(
      {
        'includeFields': [],
        'includeCustomFields': [],
        'includeMetaDataFields': []
      },
      null);

    memberApiWsClient.getMember(memberRequest, (data) => {
      member.value = data.data;
    });

  } catch (e) {
    console.log('member subscription error', e);
  }

  return {
    member
  };
}