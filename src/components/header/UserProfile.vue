<template>
  <div class="user-profile">
    <CAvatar class="profile-img" shape="rounded">{{ initials }}</CAvatar>
    <div v-if="!isMobile" class="user-info">
      <div class="user-full-name">
        <span class="full-name">{{ name }}</span>
        <span class="is-pro">pro</span>
      </div>
      <div class="is-online">
        <span class="dot"></span>
        <span class="online-text">online</span>
      </div>
    </div>
    <div v-else class="user-info">
      <div class="user-full-name">
        <span class="is-pro">pro</span>
        <span class="full-name">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CAvatar } from '@coreui/vue';
import { useMedia } from '../../hooks/useMedia';
import { getInitials } from '../../utils/getInitials';

const isMobile = useMedia('(max-width: 480px)');
const props = defineProps({name: String})
const initials = getInitials(props.name)
console.log(getInitials('1stName 2ndName 3rdName 4thName 5thName'))
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

.user-profile {
  display: flex;
  align-items: center;

  .profile-img {
    width: 46px;
    height: 49px;
    background: $dark-grey;
    border-radius: 6px;
    object-fit: cover;
    overflow: hidden;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    padding: 0 10px;

    .user-full-name {
      display: flex;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      font-style: normal;

      @media screen and (max-width: $phoneWidth) {
        flex-direction: column;
        justify-content: flex-start;

        .is-pro {
          align-self: start;
          background: linear-gradient(90deg, #6B69F9 0%, #6F6EFF 100%) !important;
        }
      }

      .full-name {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        padding-right: 10px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .is-pro {
        background: $blue;
        color: $g-0;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 11px;
        line-height: 10px;
        padding: 2px 10px;
        box-shadow: 0 0 12px rgba(111, 110, 255, 0.5);
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
        background: $light-blue;
        margin: 0 5px;
      }
      .online-text {
        font-family: 'Poppins', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 10px;
        color: $light-blue;
        text-transform: capitalize;
      }
    }
  }
}
</style>