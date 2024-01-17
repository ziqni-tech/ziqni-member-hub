import { ref } from 'vue';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';

export const useGetMemberData = () => {
  const memberData = ref(null);

  const getMemberData = async () => {
    const memberApiWsClient = await new MembersApiWs(ApiClientStomp.instance);
    const memberRequest = MemberRequest.constructFromObject(
      {
        'includeFields': [],
        'includeCustomFields': [],
        'includeMetaDataFields': []
      },
      null);

    memberApiWsClient.getMember(memberRequest, (data) => {
      memberData.value = data.data;
    });
  }


  return {
    memberData,
    getMemberData
  };
};