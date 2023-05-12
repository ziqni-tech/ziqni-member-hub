<template>
  <div class="login-page">
    <div class="login-form">
      <div class="form-row">
        <CFormInput
            label="memberRefId"
            type="text"
            v-model="memberRefIdFirstSpace"
        />
      </div>
      <div class="form-row">
        <CFormInput
            label="apiKey"
            type="text"
            v-model="apiKeyFirstSpace"
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

const router = useRouter();
const memberRefId = ref('1092564679937416');
const memberRefIdFirstSpace = ref('Player-1');
const apiKey = 'c771c80ca14d9a4263a8deead17ce083';
const apiKeyFirstSpace = '25f99a84a166da4c67abe90a30801c41';
const expires = 36000;

const generateUserToken = async () => {
  const memberTokenRequest = {
    // member: memberRefId.value,
    member: memberRefIdFirstSpace.value,
    // apiKey: apiKey,
    apiKey: apiKeyFirstSpace,
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
    router.go(0)
  } else {
    console.error('Member Token Error', body.errors[0].message);
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
        color: $main-text-color-white;
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