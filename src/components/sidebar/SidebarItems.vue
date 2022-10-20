<template>
  <CNavItem
      v-for="(item, index) in navItems"
      :key="index"
  >
    <router-link :to="item.to" class="item-link">
      <div class="icon-wrapper">
        <img class="icon" :src="item.icon" :alt="item.name" >
      </div>
      <span class="link-text">{{ item.name }}</span>
    </router-link>
  </CNavItem>
</template>

<script>
import { CNavItem } from '@coreui/vue';
export default {
  name: 'SidebarItems',
  components: {
    CNavItem
  },
  props: {
    navItems: Array
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.nav-item {
  & a {
    text-decoration: none;
    color: $sidebar-link-color;
  }

  & a:hover {
    color: $sidebar-active-link-color;
  }

  > .router-link-active {
    color: $sidebar-active-link-color;
  }

  > .router-link-active {
    padding: 49px 0;
    position: relative;
    //background: $sidebar-active-link-color;
    &:before {
      content: '';
      position: absolute;
      top: 64%;
      left: -10px;
      width: 170px;
      height: 90px;
      border-radius: 50%;
      //background: white;
      //background: $sidebar-active-link-color;
    }
    &:after {
      content: '';
      position: absolute;
      top: -38%;
      left: -10px;
      width: 170px;
      height: 90px;
      border-radius: 50%;
      //background: white;
      //background: $sidebar-active-link-color;
    }
  }

  > .router-link-active .icon-wrapper {
    margin-right: 28px;

    &:before {
      content: '';
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 84px;
      height: 84px;
      border-radius: 50%;
      //background: $sidebar-active-link-color;
      background: linear-gradient(90deg, rgba(111,100,208,1) 0%, rgba(171,167,217,1) 86%, rgba(171,167,217,1) 86%);
      transition: all 1s;
    }

    &:after {
      content: '';
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 58px;
      height: 58px;
      border-radius: 50%;
      //background: linear-gradient(144.96deg, rgba(255, 255, 255, 0) 24.08%, #EFF1F5 79.39%);
      background: linear-gradient(146.22deg, #DBE0E7 9.7%, #F8FBFF 86.02%);
      transition: all 1s;
    }
  }

  .item-link {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .icon-wrapper {
      width: 30px;
      height: 56px;
      object-fit: cover;
      position: relative;
      margin-left: 57px;

      .icon {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }

    .link-text {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      text-transform: capitalize;
      padding-bottom: 47px;
      padding-left: 16px;
    }
  }
}
</style>