<template>
  <div class="avatar">
    <div class="image-wrapper">
      <img :src="$options.profileIcon" alt="">
    </div>
    <div class="place-wrapper">
      <div class="place">
        123
      </div>
    </div>
  </div>
</template>

<script>
import profileIcon from '../../assets/icons/profile.svg';

export default {
  name: 'Avatar',
  profileIcon
};
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

  .place-wrapper {
    position: absolute;
    top: 29px;
    left: -2px;
    width: 36px;
    height: 19px;
    background: #CBCBCB;
    display: flex;
    justify-content: center;
    align-items: end;

  }
}
</style>