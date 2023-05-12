<template>
  <div class="item">
    <div
      class="avatar"
      :class="{
        'first-place': place === 'first',
        'second-place': place === 'second',
        'third-place': place === 'third'
      }"
    >
<!--      <img v-show="place === 'first'" class="crown" :src="crownIcon" />-->
<!--      <img class="profile" :src="profileIcon" />-->
    </div>
    <span class="name">name</span>
    <span class="level">level 5</span>
  </div>
</template>

<script setup>
// import crownIcon from '../../assets/images/crown.svg';
// import profileIcon from '../../assets/icons/profile.svg';

const props = defineProps({ place: String })

</script>

<style lang="scss">
.item {
  display: flex;
  flex-direction: column;

  .avatar {
    position: relative;
    border-radius: 50%;
    border: 6px solid #FFFFFF;
    margin: 0 6px;

    .crown {
      position: absolute;
      top: -70%
    }

    .profile {
      width: 80%;
      height: 80%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .first-place {
    position: relative;
    width: 93px;
    height: 93px;

    &::after {
      content: '1';
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: -15px;
      width: 22px;
      height: 22px;

      background: #FFCA28;
      border: 5px solid #534C9A;
      border-radius: 50%;

      font-family: 'NATS';
      font-style: normal;
      font-weight: 400;
      color: #615AA6;
    }
  }

  .second-place {
    position: relative;
    width: 60px;
    height: 60px;
    margin-top: 20px;

    &::after {
      content: '2';
      position: absolute;
      bottom: -15px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;

      background: #F4F4F4;
      border: 5px solid #433D82;
      border-radius: 50%;

      font-family: 'NATS';
      font-style: normal;
      font-weight: 400;
      color: #615AA6;
    }
  }

  .third-place {
    position: relative;
    width: 60px;
    height: 60px;
    margin-top: 20px;

    &::after {
      content: '3';
      position: absolute;
      bottom: -15px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;

      background: #FF8228;
      border: 5px solid #615AA6;
      border-radius: 50%;

      font-family: 'NATS';
      font-style: normal;
      font-weight: 400;
      color: #615AA6;
    }
  }

  .name {
    height: 26px;
    font-family: 'NATS';
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    color: #FFFFFF;
  }

  .level {
    height: 22px;
    font-family: 'NATS';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    color: #FFFFFF;
  }
}
</style>