<template>
  <div class="user-progress">
    <div class="img-wrapper">
      <img class="img" src="../../assets/icons/hat.svg" />
    </div>
    <CProgress :height="7" >
      <CProgressBar :value="25" />
    </CProgress>
  </div>
</template>

<script>
import { CProgress, CProgressBar, CImage } from '@coreui/vue';

export default {
  name: 'UserProgress',
  components: {
    CImage,
    CProgress,
    CProgressBar
  }
};
</script>

<style lang="scss">
.user-progress {
  display: flex;
  align-items: center;

  .img-wrapper {
    width: 49px;
    height: 29px;
    object-fit: cover;
    overflow: hidden;
    margin-right: 3px;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  .progress {
    width: 185px;
    background: linear-gradient(180deg, #EDDFF3 0%, #E8EAEC 100%);
    border-radius: 24px;

    .progress-bar {
      background: linear-gradient(180deg, #988AFF 0%, #5945ED 100%);
      box-shadow: inset 0px 2px 4px rgba(255, 255, 255, 0.25), inset 0px -2px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
    }
  }
}
</style>