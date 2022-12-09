<template>
  <div class="login-page">
    <div class="login-form">
      <CFormInput
        type="text"
        v-model="memberRefId"
      />
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
const apiKey = 'c771c80ca14d9a4263a8deead17ce083';
const expires = 36000;

const generateUserToken = async () => {
  const memberTokenRequest = {
    member: memberRefId.value,
    apiKey: apiKey,
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
    await router.push({ path: '/dashboard' })
  } else {
    console.error('Member Token Error', body.errors[0].message);
  }
}
</script>

<style lang="scss">
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #FAFAFE;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    position: absolute;
    top: 35%;
  }

  .login-btn {
    margin-top: 25px;
    width: 100%;
  }
}
</style>