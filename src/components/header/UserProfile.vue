<template>
  <div class="user-profile">
    <CAvatar class="profile-img" shape="rounded">CUI</CAvatar>
    <div class="user-info">
      <div class="user-full-name">
        <span class="full-name">Clinton Peltonen</span>
        <span class="is-pro">pro</span>
      </div>
      <div class="is-online">
        <span class="dot"></span>
        <span class="online-text">online</span>
      </div>
    </div>
  </div>
</template>

<script>
import { CAvatar } from '@coreui/vue';

export default {
  name: 'UserProfile',
  components: {
    CAvatar
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.user-profile {
  display: flex;
  align-items: center;

  .profile-img {
    width: 46px;
    height: 49px;
    background: #DDDDE6;
    border-radius: 6px;
    object-fit: cover;
    overflow: hidden;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    color: $nav-text-color;

    .user-full-name {
      display: flex;
      align-items: center;
      font-family: 'Roboto';
      font-style: normal;

      .full-name {
        font-weight: 600;
        font-size: 14px;
        line-height: 10px;
        padding-right: 10px;
      }
      .is-pro {
        background: $bg-orange;
        color: $text-white;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 11px;
        line-height: 10px;
        padding: 2px 10px;
        box-shadow: 0px 0px 12px rgba(111, 110, 255, 0.5);
        border-radius: 4px;
      }
    }

    .is-online {
      display: flex;
      align-items: center;
      padding-top: 5px;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #534ABA;
        margin: 0 5px;
      }
      .online-text {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 10px;
        color: #534ABA;
        text-transform: capitalize;
      }
    }
  }
}
</style>