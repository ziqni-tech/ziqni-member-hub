<template>
  <div class="login-page">
    <div class="login-page-loader" v-if="isLoading">
      <img
          class="spinner"
          src="@/assets/icons/logo.svg"
          alt=""
      >
    </div>
    <div class="login-form">
      <div class="form-row">
        <CFormInput
            label="memberRefId"
            type="text"
            v-model="memberRefId"
        />
      </div>
      <div class="form-row">
        <CFormInput
            label="apiKey"
            type="text"
            v-model="apiKey"
        />
      </div>
      <button class="m-btn login-btn" @click="generateUserToken">
        Log In
      </button>
    </div>
  </div>
</template>

<script setup>
import { CFormInput } from '@coreui/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { ApiClientStomp } from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';
import Loader from '@/components/Loader.vue';

const router = useRouter();
const memberRefId = ref('Player-1');
// const apiKey = ref('18289fd2aa4c7a43c5abb14abe83009f');
const apiKey = ref('25f99a84a166da4c67abe90a30801c41');
const expires = 1440;
const isLoading = ref(false)
const store = useStore()

const generateUserToken = async () => {
  isLoading.value = true
  try {
    const memberTokenRequest = {
      member: memberRefId.value,
      apiKey: apiKey.value,
      isReferenceId: true,
      expires: expires,
      resource: 'ziqni-gapi'
    };

    const response = await fetch('https://api.ziqni.com/member-token', {
      method: 'post',
      body: JSON.stringify(memberTokenRequest),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const body = await response.json();

    if (body.data && body.data.jwtToken) {
      const token = body.data.jwtToken;
      localStorage.setItem('token', token);

      await ApiClientStomp.instance.connect({ token: token });
      await store.dispatch('setIsConnectedClient', true);

      setTimeout(() => {
        isLoading.value = false
        window.location.reload()
      }, 2000)


    } else {
      console.error('Member Token Error', body.errors[0].message);
    }
  } catch (err) {
    console.log('generateUserToken error => ', err);
  }
}

const isLoggedIn = !!localStorage.getItem('token');

if (isLoggedIn) {
  router.push('/dashboard');
}
</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $bg-secondary-LM;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $body-text-color;

  .login-page-loader {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;

    .spinner {
      width: 47px;
      height: 45px;
      opacity: 0.7;
      animation: rotation 2.5s linear infinite normal;

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
    }
  }

  .login-form {
    position: absolute;
    top: 35%;

    .form-row {
      display: flex;
      align-items: center;
      padding-bottom: 15px;

      .form-control {
        background-color: $bg-body-LM;
        color: $card-text-color-LM;
      }

      .form-label {
        margin-right: 10px;
        color: $card-text-color-LM;
        font-size: 16px;
        font-family: $mainFont;
      }
    }
  }

  .login-btn {
    margin-top: 25px;
    width: 100%;
    background-color: $btn-primary-bg-color-LM;
    border-radius: $border-radius;
  }
}
</style>