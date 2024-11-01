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
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router'
import { ApiClientStomp } from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';
import Loader from '@/components/Loader.vue';

const router = useRouter();
const memberRefId = ref('');
const defaultMemberRefId = ref('Player-1');

const apiKey = ref('');
const defaultApiKey = ref('eyJhbGciOiJIUzUxMiJ9.eyJhcGlfa2V5X2lkIjoiRXc1OTBvc0J5bURMYjNQdHJvbEciLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiWEFQSSIsImFjY291bnRfaWQiOiJGN204ZEh3QnN3LU9IM01Fb1cyMyIsInNwYWNlX25hbWUiOiJmaXJzdC1zcGFjZSIsIm5hbWUiOiJYQVBJIiwibWVtYmVyX3R5cGUiOiJYQVBJIiwibWVtYmVyX2lkIjoiZGQxNDdkYzItNzdmZS00ZDFiLTg4ZTUtYmQ1M2Y2NWY1NWIyIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWFhcGkiOnsicm9sZXMiOlsiQ3JlYXRlTWVtYmVyVG9rZW4iXX19LCJ0eXAiOiJ4LWFwaS1rZXkiLCJzdWIiOiJkZDE0N2RjMi03N2ZlLTRkMWItODhlNS1iZDUzZjY1ZjU1YjIiLCJqdGkiOiJkZmNjODI5MC02OTg4LTQwZjQtYWNjMi02MWQ1NTMyYmI5NDkiLCJpYXQiOjE3MDAwNDM1MzMsImV4cCI6MTczMTU3OTUzMywiYXpwIjoiZmlyc3Qtc3BhY2UuemlxbmkuYXBwIn0.M7f5eafAxhFhpN2FEfpvbKRJiwltzrF-wx9N-SgNeIPOsECl2lBz_ucR3AdFzaj_CaZgL94xXAuIg-CaksSM6A');
// const apiKey = ref('eyJhbGciOiJIUzUxMiJ9.eyJhcGlfa2V5X2lkIjoiV1NLSVdvMEI2SnQ4eU4tdHo2SG4iLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiWEFQSSIsImFjY291bnRfaWQiOiJDaGRMV28wQjZKdDh5Ti10dHAxSiIsInNwYWNlX25hbWUiOiJwb3dlcnNiZXQiLCJuYW1lIjoiWEFQSSIsIm1lbWJlcl90eXBlIjoiWEFQSSIsIm1lbWJlcl9pZCI6IjMxZTM0MWYyLWJjMmItNGRlMi1hY2UyLWI5ZTNlYjAwMzYzYyIsInJlc291cmNlX2FjY2VzcyI6eyJ6aXFuaS1hYXBpIjp7InJvbGVzIjpbIkNyZWF0ZU1lbWJlclRva2VuIl19fSwidHlwIjoieC1hcGkta2V5Iiwic3ViIjoiMzFlMzQxZjItYmMyYi00ZGUyLWFjZTItYjllM2ViMDAzNjNjIiwianRpIjoiMGU2Y2YwYTctYTEyYi00N2E0LTgwZjEtOWQ0ZTk1YmZlNGU3IiwiaWF0IjoxNzA2NjIwOTMyLCJleHAiOjE3MzgxNTY5MzIsImF6cCI6InBvd2Vyc2JldC56aXFuaS5hcHAifQ.gCpPXhst8yrMZVw3Qg4xQqDD1Bf21H5ZfmXFV5p9TkeqBJ7NQNkpvO3emRc7UYBumpf5Lo78ScEDCfG1IdcqnA');
const expires = 1000;
const isLoading = ref(false)
const store = useStore()

onBeforeMount(async () => {
  const urlParams = new URLSearchParams(window.location.search);

  memberRefId.value = urlParams.get('memberRefId') ? urlParams.get('memberRefId') : defaultMemberRefId.value;
  apiKey.value = urlParams.get('apiKey') ? urlParams.get('apiKey') : defaultApiKey.value;
});

const generateUserToken = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');

  isLoading.value = true;

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

      await ApiClientStomp.instance.connect({ token: token });
      await store.dispatch('setIsConnectedClient', true);
      localStorage.setItem('token', token);

      setTimeout(() => {
        isLoading.value = false
        window.location.reload()
      }, 3000)


    } else {
      console.error('Member Token Error', body.errors[0].message);
    }
  } catch (err) {
    console.log('generateUserToken error => ', err);
  }
}

const isLoggedIn = !!localStorage.getItem('token');

if (isLoggedIn) {
  router.push({ name: 'Dashboard' });
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
