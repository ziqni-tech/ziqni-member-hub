<template>
  <CNavItem
      v-for="(item, index) in navItems"
      :key="index"
      :class="isDarkMode ? 'dark-mode' : 'light-mode'"
  >
    <router-link :to="item.to" class="item-link">
      <div class="icon-wrapper">
        <component class="icon" :is="item.icon"/>
      </div>
      <span class="link-text">{{ item.name }}</span>
    </router-link>
  </CNavItem>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const props = defineProps({ navItems: Array });
const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);

</script>

<style lang="scss">
@import 'src/assets/scss/utils/vars';

.nav-item.dark-mode {
  & a:hover {
    color: $sts-grey-light;
  }

  > .router-link-active {
    color: $sts-grey-light;
  }
}

.nav-item {
  & a {
    text-decoration: none;
    color: $sts-grey-medium-lighter;
  }

  & a:hover {
    color: $sts-grey-medium;
  }

  > .router-link-active {
    color: $sts-grey-medium;
  }

  > .router-link-active {
    padding: 49px 0;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 116px;
      height: 169px;
      background-image: url('../../assets/icons/icon_siri.svg');
      background-size: contain;
      background-repeat: no-repeat;
      top: 28px;
      left: 23px;
      transition: all 1s;
      z-index: 5;
    }
  }

  > .router-link-active .icon-wrapper {
    margin-right: 28px;

    &:before {
      content: '';
      position: absolute;
      width: 115px;
      height: 170px;
      background-image: url('../../assets/icons/Sellectio_blue.svg');
      background-size: contain;
      background-repeat: no-repeat;
      top: -87px;
      left: -54px;
      transition: all 1s;
      z-index: 3;
    }
  }

  .item-link {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    .icon-wrapper {
      width: 35px;
      object-fit: cover;
      position: relative;
      margin-left: 57px;

      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 35px;
        height: 35px;
        z-index: 7;
      }
    }

    .link-text {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      text-transform: capitalize;
      padding: 20px 15px;
    }
  }
}
</style>