<template>
  <div class="avatar">
    <div class="image-wrapper">
      <img :src="profileIcon" alt="">
    </div>
    <div class="place-wrapper" :class="setPlaceWrapperBg">
      <div class="place" :class="setPlaceTextColor">
        {{ setPlace }}
      </div>
    </div>
  </div>
</template>

<script setup>
import profileIcon from '../../assets/icons/profile.svg';
import { computed } from 'vue';

const props = defineProps({ place: Number });

const setPlace = computed(() => {
  switch (props.place) {
    case 1:
      return `${props.place}st`;
    case 2:
      return `${props.place}nd`;
    case 3:
      return `${props.place}rd`;
    default:
      return `${props.place}th`;
  }
})

const setPlaceTextColor = computed(() => {
  if (props.place < 4) {
    return 'black-text-color'
  } else {
    return 'white-text-color'
  }
})

const setPlaceWrapperBg = computed(() => {
  switch (props.place) {
    case 1:
      return `first-place-wrapper-bg`;
    case 2:
      return `second-place-wrapper-bg`;
    case 3:
      return `third-place-wrapper-bg`;
    default:
      return `default-place-wrapper-bg`;
  }
})
</script>

<style lang="scss">
.avatar {
  width: 36.5px;
  height: 36.5px;
  border: 2px solid #F6876A;
  background: #5D53C2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .image-wrapper {
    width: inherit;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
    overflow: hidden;

    & > img {
      width: 18px;
      height: 18px;
    }
  }

  .first-place-wrapper-bg {
    background: #F2DB94;
  }
  .second-place-wrapper-bg {
    background: #CBCBCB;
  }
  .third-place-wrapper-bg {
    background: #F5C1A1;
  }
  .default-place-wrapper-bg {
    background: black;
  }

  .place-wrapper {
    position: absolute;
    top: 29px;
    left: -2px;
    width: 36px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: end;

    .place {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 15px;
      line-height: 22px;
    }
    .black-text-color {
      color: #2F2F2F;
    }
    .white-text-color {
      color: #EFEFEF;
    }
  }
}
</style>