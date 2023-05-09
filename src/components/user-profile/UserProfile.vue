<template>
  <div id="user-profile">
    <div class="background-block" :style="{ 'background-image': `url(${require('@/assets/images/world-cup.jpg')})` }">
      <div class="buttons">
        <button class="btn"><img :src="notificationIcon" alt=""></button>
        <button class="btn"><img :src="sunIcon" alt=""></button>
      </div>
    </div>
    <div class="user-info">
      <div class="user-image">img</div>
      <div class="user-name">user name</div>
      <div class="pro-label">pro</div>
      <div class="info-block">
        <ProfileInfoItem :icon="gamesIcon" :title="'Total game'" :data="'2000'" />
        <ProfileInfoItem :icon="pointsIcon" :title="'Points'" :data="'1200'" />
        <ProfileInfoItem :icon="winIcon" :title="'Win'" :data="'85%'" />
        <ProfileInfoItem :icon="loseIcon" :title="'Lose'" :data="'15%'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileInfoItem from './ProfileInfoItem';
import gamesIcon from '@/assets/icons/user-info/GameController.png'
import pointsIcon from '@/assets/icons/user-info/Medal.png'
import winIcon from '@/assets/icons/user-info/Trophy.png'
import loseIcon from '@/assets/icons/user-info/Skull.png'
import notificationIcon from '@/assets/icons/user-info/notification.png'
import sunIcon from '@/assets/icons/user-info/sun.png'

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

#user-profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;

  .background-block {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 24%;
    overflow: hidden;

    .profile-background > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .buttons {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 12px;

      .btn {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid rgba(230, 230, 230, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .user-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 42px;

    .user-image {
      position: absolute;
      top: -68px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #bad4e1;
    }

    .user-name {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $sidebar-text-color;
    }

    .pro-label {
      margin-top: 5px;
      border-radius: 5px;
      text-transform: uppercase;
      background: #7ED4E7;
      padding: 0 10px;
      font-weight: 700;
      font-size: 10px;
      line-height: 12px;
    }

    .info-block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 41px 16px;
      margin-top: 50px;
    }
  }
}
</style>