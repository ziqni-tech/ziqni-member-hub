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

const apiKey = ref('eyJhbGciOiJIUzUxMiJ9.eyJhcGlfa2V5X2lkIjoiRXc1OTBvc0J5bURMYjNQdHJvbEciLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiWEFQSSIsImFjY291bnRfaWQiOiJGN204ZEh3QnN3LU9IM01Fb1cyMyIsInNwYWNlX25hbWUiOiJmaXJzdC1zcGFjZSIsIm5hbWUiOiJYQVBJIiwibWVtYmVyX3R5cGUiOiJYQVBJIiwibWVtYmVyX2lkIjoiZGQxNDdkYzItNzdmZS00ZDFiLTg4ZTUtYmQ1M2Y2NWY1NWIyIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWFhcGkiOnsicm9sZXMiOlsiQ3JlYXRlTWVtYmVyVG9rZW4iXX19LCJ0eXAiOiJ4LWFwaS1rZXkiLCJzdWIiOiJkZDE0N2RjMi03N2ZlLTRkMWItODhlNS1iZDUzZjY1ZjU1YjIiLCJqdGkiOiJkZmNjODI5MC02OTg4LTQwZjQtYWNjMi02MWQ1NTMyYmI5NDkiLCJpYXQiOjE3MDAwNDM1MzMsImV4cCI6MTczMTU3OTUzMywiYXpwIjoiZmlyc3Qtc3BhY2UuemlxbmkuYXBwIn0.M7f5eafAxhFhpN2FEfpvbKRJiwltzrF-wx9N-SgNeIPOsECl2lBz_ucR3AdFzaj_CaZgL94xXAuIg-CaksSM6A');
// const apiKey = ref('eyJhbGciOiJIUzUxMiJ9.eyJhcGlfa2V5X2lkIjoiWjhmMDdZd0I2SnQ4eU4tdHg2bXkiLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiWEFQSSIsImFjY291bnRfaWQiOiJjY2JUN1l3QjZKdDh5Ti10YlR1aiIsInNwYWNlX25hbWUiOiJjb2luaGVybyIsIm5hbWUiOiJYQVBJIiwibWVtYmVyX3R5cGUiOiJYQVBJIiwibWVtYmVyX2lkIjoiMzFlMzQxZjItYmMyYi00ZGUyLWFjZTItYjllM2ViMDAzNjNjIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWFhcGkiOnsicm9sZXMiOlsiQ3JlYXRlTWVtYmVyVG9rZW4iXX19LCJ0eXAiOiJ4LWFwaS1rZXkiLCJzdWIiOiIzMWUzNDFmMi1iYzJiLTRkZTItYWNlMi1iOWUzZWIwMDM2M2MiLCJqdGkiOiJhMmI2NjdlNC1iMzdmLTQ0MGYtODFmMy02MjI2NDIxMmExZDAiLCJpYXQiOjE3MDQ3OTkyOTEsImV4cCI6MTczNjMzNTI5MSwiYXpwIjoiY29pbmhlcm8uemlxbmkuYXBwIn0.ASZquda75OpL13dRl7wA_qCI1ws0jYpdkrNAHiErnWHMd1vugS39DfeXk52jpk6fsc-07gXJzgUVjSK79T1zQw');
const expires = 100;
const isLoading = ref(false)
const store = useStore()

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