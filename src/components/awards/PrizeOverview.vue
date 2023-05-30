<template>
<div class="prize-overview">
  <h3 class="prizes-title">Uncover your prize by scratching away!</h3>
  <div class="prizes">
    <div class="prize-wrapper" v-for="(prize, idx) in prizes">
      <div class="prize">
        <img :src="prize" alt="prize">
      </div>

      <span class="prize-name">{{ prizeName(idx) }} prize</span>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  prizes: Array
})

const prizeName = computed(() => (idx) => {
  switch (idx) {
    case 0:
      return 'first';
    case 1:
      return 'second';
    case 2:
      return 'third';
  }
})

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.prize-overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  .prizes-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $main-text-color-white;
  }

  .prizes {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;

    .prize-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;

      .prize {
        position: relative;
        overflow: hidden;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
        margin: 0 16px;

        & > img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .prize-name {
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: $body-text-color;
        margin-top: 15px;
        text-transform: capitalize;
      }
    }
  }
}
</style>