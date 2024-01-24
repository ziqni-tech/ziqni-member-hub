<template>
  <div
      class="default-layout"
      :class="{'light-mode': !isDarkMode, 'sidebar-narrow': isSidebarNarrow}"
  >

    <div class="content">
      <div id="main-block">
        <div v-if="isClientConnected" class="main-block_content">
          <router-view/>
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>

import { ApiClientStomp, FilesApiWs, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { useRouter } from 'vue-router';

import TheSidebar from '../components/sidebar/TheSidebar';
import TheHeader from '../components/TheHeader';
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import MobileNav from '@/components/sidebar/MobileNav';
import useMobileDevice from '@/hooks/useMobileDevice';
import UserProfileMobile from '@/components/user-profile/UserProfileMobile.vue';
import NotificationIcon from '@/shared/components/svg-icons/NotificationIcon.vue';
import PersonIcon from '@/shared/components/svg-icons/PersonIcon.vue';
import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';
import splitCamelCaseToWords from '../utils/splitCamelCaseToWords';
import Notifications from '@/components/notifications/Notifications.vue';

const router = useRouter();
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const currentMember = reactive({});
const isNotificationsList = ref(false);
const { isMobile } = useMobileDevice();

const isGoBackBtn = computed(() => {
  const pathLength = router.currentRoute.value.path.split('/').length;

  return !!(router.currentRoute.value.params.id || pathLength > 2);
});

const isProfileInfo = ref(false);

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};


const openProfileInfo = () => {
  isProfileInfo.value = true;
};

const closeProfileInfo = () => {
  isProfileInfo.value = false;
};

const openNotifications = () => {
  isNotificationsList.value = true;
};

const closeNotifications = () => {
  isNotificationsList.value = false;
};

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('auth');

  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: authToken });
  await store.dispatch('setIsConnectedClient', true);
});

const getMemberRequest = async () => {
  const memberRequest = MemberRequest.constructFromObject(
      {
        'includeFields': [],
        'includeCustomFields': [],
        'includeMetaDataFields': []
      },
      null);

  const memberApiWsClient = new MembersApiWs(ApiClientStomp.instance);

  memberApiWsClient.getMember(memberRequest, async (data) => {
    currentMember.value = await data.data;
    await store.dispatch('setMemberAction', data.data);
  });
};

watch(isClientConnected, (value) => {
  if (value) getMemberRequest();
});

const isSidebarNarrow = ref(false)
const isSidebarNarrowValue = computed(() => store.getters.getIsSidebarNarrow)

onBeforeMount(() => {
  if (isSidebarNarrowValue.value) {
    isSidebarNarrow.value = isSidebarNarrowValue.value
  }
})
const toggleSidebar = () => {
  isSidebarNarrow.value = !isSidebarNarrow.value
  store.dispatch('setIsSidebarNarrow', isSidebarNarrow.value)
}


const logOut = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');
  await router.push({ path: '/login' });
};
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/_variables';

.default-layout {
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: "main";
  height: 100%;
  width: 100%;

  &.sidebar-narrow {
    grid-template-columns: 100%;
  }

  .sidebar-narrow-btn {
    opacity: 0;
    cursor: pointer;
    background: #0F1921;
    height: 25px;
    width: 25px;
    text-align: center;
    transform: translateX(3px) rotate(45deg);
    left: 14.2%;
    top: 59px;
    border-radius: 5px;
    border: 3px solid #0F1921;
    transition: 0.3s;
    z-index: 100;
    position: absolute;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .arrow-box {
      width: 100%;
      height: 100%;
      background: #8B96BE;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;

      .arrow {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 5px;
        border-left: 3px solid #FDFDFF;
        border-bottom: 3px solid #FDFDFF;
      }

      .arrow {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 5px;
        border-left: 3px solid #FDFDFF;
        border-bottom: 3px solid #FDFDFF;
      }
    }

    &.sidebar-narrow {
      left: 3.7%;

      .arrow-box {

        .arrow {
          width: 100%;
          height: 100%;
          border-bottom-left-radius: 5px;
          border-left: none;
          border-bottom: none;
          border-right: 3px solid #FDFDFF;
          border-top: 3px solid #FDFDFF;
        }
      }
    }

    &:hover {
      opacity: 1;
    }

    &__visible {
      opacity: 1;
    }
  }

  #nav-block:hover + .sidebar-narrow-btn {
    opacity: 1;
  }

  #nav-block {
    grid-area: nav;
    background-color: $secondary-bg-DM;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
    z-index: 0;
    padding: 0 12px;
  }

  #nav-block.sidebar-narrow {
    width: 4.5%;
    padding: 0 5px;
  }

  .content {
    grid-area: main;

    #main-block {
      padding: 74px 0 0 20px;
      background-color: $main-bg-DM;
      overflow: hidden;
      height: 100%;
      position: relative;

      .main-block_content {
        position: absolute;
        top: 73px;
        left: 0;
        width: 100%;
        height: calc(100% - 80px);
        padding: 20px 34px 0 20px;
      }

      .notificationsList {
        max-width: 270px;
        position: fixed;
        top: 0;
        right: -270px;
        z-index: 10;
        transition: right 0.3s ease-in-out;
      }

      .notificationsList.open {
        right: 0;
      }

      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }

  &.light-mode {
    .sidebar-narrow-btn {
      background: #FFFFFF;
      border: 3px solid #FFFFFF;

      .arrow-box {
        background: #B9CEDF;
      }

      &.sidebar-narrow {
        .arrow-box {
          .arrow {
            border-right: 3px solid #FFFFFF;
            border-top: 3px solid #FFFFFF;
          }
        }
      }

    }

    #nav-block {
      background-color: $bg-secondary-LM;
    }

    #main-block {
      background-color: $bg-body-LM;

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    #user-profile-block {
      background-color: $bg-secondary-LM;
    }
  }
}

.notificationsList-mobile {
  position: fixed;
  top: 0;
  right: -100%;
  z-index: 11;
  transition: right 0.3s ease-in-out;
}

.notificationsList-mobile.open {
  right: 0;
}
</style>