<template>
  <div class="login-page">
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

const router = useRouter();
const memberRefId = ref('Player-1');
const apiKey = ref('25f99a84a166da4c67abe90a30801c41');
const expires = 36000;

const store = useStore()

const generateUserToken = async () => {
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

      // await router.push({ name: 'Dashboard' }).catch(() => {});
      window.location.reload()

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
  background: $dark-grey;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $body-text-color;

  .login-form {
    position: absolute;
    top: 35%;

    .form-row {
      display: flex;
      align-items: center;
      padding-bottom: 15px;

      .form-control {
        background-color: $light-grey;
        color: $text-color-white;
      }

      .form-label {
        margin-right: 10px;
      }
    }
  }

  .login-btn {
    margin-top: 25px;
    width: 100%;
    background-color: $purple;
    border-radius: $border-radius;
  }
}
</style>