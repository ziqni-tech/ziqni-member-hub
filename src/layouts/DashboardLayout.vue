<template>
  <div
      id="app-layout"
      :class="{'light-mode': !isDarkMode, 'sidebar-narrow': isSidebarNarrow}"
  >
    <div id="main-block">
      <Dashboard/>
    </div>
  </div>
</template>

<script setup>
import { ApiClientStomp, FilesApiWs, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onBeforeMount, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import Dashboard from '@/views/Dashboard';
import useMobileDevice from '@/hooks/useMobileDevice';


const router = useRouter();

const store = useStore();
const isReady = ref(false);
const { isMobile } = useMobileDevice();
const message = ref(null);
const isDarkMode = computed(() => store.getters.getTheme);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const isProfileInfo = ref(false);
const isNotificationsList = ref(false);

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

onBeforeMount(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('auth');

  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: authToken });
  await store.dispatch('setIsConnectedClient', true);
});

window.addEventListener('message', function(event) {
  const type = event.data.type;
  const { data } = event.data;
  if (type === 'navigate') {
    router.push(data.path);
  }
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
    await store.dispatch('setMemberAction', data.data);
    isReady.value = true;
  });
};

watch(isClientConnected, (value) => {
  if (value) getMemberRequest();
});

const logOut = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');
  await router.push({ path: '/login' });
};

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
</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

#app-layout {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  grid-template-areas: "main";
  height: 100%;
  margin: 0;

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
    //z-index: 100;
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
    padding: 0 12px;

  }

  #nav-block.sidebar-narrow {
    width: 4.5%;
    padding: 0 5px;
  }

  #main-block {
    grid-area: main;
    padding: 20px 34px 0 20px;
    background-color: $main-bg-DM;
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  #user-profile-block {
    grid-area: user-profile;
    background-color: $secondary-bg-DM;
    position: fixed;
    right: 0;
    height: 100%;
    overflow: auto;
    width: 20%;
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

.user-profile {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  transition: right 0.3s ease-in-out;
}

.user-profile.open {
  right: 0;
}

.app-spinner {
  height: 100vh;
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