<template>
<div class="info-item" :class="{'light-mode': !isDarkMode}">
  <div class="item-icon">
    <component :is="icon" :strokeColor="getIconStrokeColor()" />
  </div>
  <div class="info-title">{{ title }}</div>
  <div class="info-data">{{ data }}</div>
</div>
</template>

<script setup>
const props = defineProps({
  title: String,
  data: String,
  icon: Object,
  isDarkMode: Boolean
})

const getIconStrokeColor = () => {
  return props.isDarkMode ? '#FFFFFF' : '#080D12'
};

</script>

<style lang="scss">
@import "@/assets/scss/_variables";

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid $info-item-icon-bg-DM;
  border-radius: 10px;
  padding: 33px 15px 10px;
  background-color: $info-item-bg-DM;

  .item-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid $info-item-icon-bg-DM;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -25px;
    background-color: $info-item-icon-bg-DM;
  }

  .info-title {
    font-size: 14px;
    font-family: $medium;
    color: $body-text-color;
  }

  .info-data {
    font-size: 20px;
    color: $text-color-white;
    font-family: $bold;
  }

  &.light-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border: 1px solid $info-item-bg;
    border-radius: 10px;
    padding: 33px 15px 10px;
    background-color: $bg-body-LM;
    font-family: $semi-bold;

    .item-icon {
      border: 1px solid $info-item-bg;
      background-color: $info-item-bg;
    }

    .info-title {
      font-size: 14px;
      font-family: $medium;
      color: $info-name-color;
    }

    .info-data {
      font-size: 20px;
      color: $section-title-color-LM;
      font-family: $bold;
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border: 1px solid $btn-border-grey;
    border-radius: 10px;
    padding: 33px 15px 10px;
    background-color: $dark-grey;
    font-family: $semi-bold;

    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid $btn-border-grey;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -20px;
      background-color: $lighter-grey;
    }

    .info-title {
      font-size: 16px;
      color: $body-text-color;
    }

    .info-data {
      font-weight: 700;
      font-size: 22px;
      line-height: 17px;
      color: $text-color-white;
    }
  }
}
</style>