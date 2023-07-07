<template>
  <div class="blazzio-navigation">
    <div
        v-for="(item, index) in navItems"
        :key="index"
        class="nav-item"
    >
      <a :href="item.to" class="nav-item-link">
        <div class="nav-item__icon-wrapper">
          <component class="icon" :is="item.icon" :strokeColor="getIconStrokeColor(item)"/>
        </div>
        <span class="nav-item__title">{{ item.name }}</span>
      </a>
    </div>
    <div class="dividing-line"></div>
  </div>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import { useRoute } from 'vue-router';
const props = defineProps({ navItems: Array });

const route = useRoute();
const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return '#8749DC';
  } else {
    return '#8B96BE';
  }
};

</script>

<style lang="scss" scoped>
@import 'src/assets/scss/_variables';
.blazzio-navigation {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 13px;

  .dividing-line {
    width: 100%;
    border-bottom: 1px solid $btn-border-grey;
    margin-top: 20px;
  }

  .nav-item {
    font-family: $semi-bold;
    width: 100%;
    padding: 8px 13px;
    border-radius: 10px;
    max-width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .nav-item-link {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    & a {
      padding: 0;
      text-decoration: none;
      color: $sidebar-text-color;
    }

    & a:hover {
      color: $text-color-white;
    }

    &__icon-wrapper {
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      object-fit: cover;
      margin-right: 11px;

      .icon {
        width: inherit;
        height: inherit;
        fill: none;
      }
    }

    &__title {
      font-size: 16px;
    }

    > .router-link-active {
      color: $text-color-white;

      &:before {
        left: -20px;
        content: "";
        position: absolute;
        width: 56px;
        height: 95px;
        background-image: radial-gradient(84.48% 157.68% at 50.5% 101.43%, rgb(127, 33, 255) 0%, rgba(41, 24, 79, 0) 66.15%, rgba(19, 22, 33, 0) 100%);
        opacity: 0.2;
        transform: rotate(90deg);
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .nav-item {
    padding: 11px 8px;

    &__icon-wrapper {
      margin-right: 8px;
    }
  }
}

@media screen and (max-width: 980px) {
  .nav-item {
    padding: 10px 5px;

    &__icon-wrapper {
      margin-right: 5px;
    }
  }
}
</style>