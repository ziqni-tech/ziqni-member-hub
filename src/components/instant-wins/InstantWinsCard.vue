<template>
 <div class="instant-wins-card">
  <div class="instant-img" :style="{ 'background-image': `url(${img})` }"></div>
  <div class="instant-info">
    <h3 class="card-title">{{ title }}</h3>
    <span class="card-description">{{ description }}</span>
    <button class="play-btn">Play</button>
  </div>
 </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  img: String
})
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.instant-wins-card {
  display: flex;
  padding: 10px;
  border-radius: 10px;
  background-color: $light-grey;

  width: 100%;
  height: auto;
  aspect-ratio: 3 / 1;

  .instant-img {
    width: 44%;
    height: 100%;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }

  .instant-info {
    display: flex;
    flex-direction: column;
    width: 56%;
    height: 100%;
    padding: 6px 16px 0;

    .card-title {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
    }

    .card-description {
      font-weight: 400;
      font-size: 12px;
      line-height: 146.5%;
      color: $main-text-color-white;
      margin-top: 10px;
    }

    .play-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $purple;
      border-radius: 10px;
      border: 1px solid $border-dark;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;

      margin-top: auto;
      max-width: 124px;
    }
  }
}
</style>