<template>
  <div class="user-progress">
    <div class="img-wrapper">
      <img class="img" src="../../assets/icons/hat.svg" />
    </div>
    <CProgress v-if="!isMobile" :height="7" >
      <CProgressBar :value="25" />
    </CProgress>
    <span v-else class="progress-value">25</span>
  </div>
</template>

<script>
import { CProgress, CProgressBar, CImage } from '@coreui/vue';
import { useMedia } from '../../hooks/useMedia';

export default {
  name: 'UserProgress',
  components: {
    CImage,
    CProgress,
    CProgressBar
  },
  setup() {
    const isMobile = useMedia('(max-width: 480px)')

    return {isMobile}
  },
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

  .progress-value {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 10px;
    color: #000000;
    padding-right: 14px;
  }
}
</style>