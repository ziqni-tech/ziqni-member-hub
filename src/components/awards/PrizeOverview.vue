<template>
<div class="prize-overview" :class="{'light-mode': !isDarkMode}">
  <h3 class="prizes-title">Uncover your prize by scratching away!</h3>
  <div class="prizes">
    <div class="prize-wrapper" v-for="(prize) in prizes">
      <div class="prize">
        <img :src="prize.image" alt="prize">
      </div>
      <span class="prize-name">{{ prize.prize }} prize</span>
    </div>
  </div>
  <button class="scratch-all-btn" @click="scratchAllCards">Scratch all</button>
</div>
</template>

<script setup>
const props = defineProps({
  prizes: Array,
  isDarkMode: Boolean
})

const emit = defineEmits(['scratchAllCards']);

const scratchAllCards = () => {
  emit('scratchAllCards');
}

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.prize-overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  .prizes-title {
    font-family: $bold;
    font-size: 14px;
    color: $text-color-white;
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
          width: 85%;
          height: 85%;
        }
      }

      .prize-name {
        font-family: $mainFont;
        font-size: 14px;
        color: $prize-name-DM;
        margin-top: 15px;
        text-transform: capitalize;
      }
    }
  }

  .scratch-all-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 57px;
    background: $btn-primary-bg-color-LM;
    border-radius: $border-radius;
    border: none;
    margin-top: 50px;

    font-family: $bold;
    font-size: 14px;
    color: $text-color-white;
  }

  &.light-mode {
    .prizes-title {
      font-family: $bold;
      font-size: 14px;
      color: $btn-prize-color-LM;
    }

    .prizes {
      .prize-wrapper {
        .prize-name {
          font-family: $mainFont;
          font-size: 14px;
          color: $prize-name-LM;
          margin-top: 15px;
          text-transform: capitalize;
        }
      }
    }
  }
}
@media screen and (max-width: $tableWidth) {
  .prize-overview {
    display: flex;
    flex-direction: column;
    align-items: center;

    .prizes-title {
      font-size: 14px;
    }

    .prizes {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;

      .prize-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .prize {
          position: relative;
          overflow: hidden;
          width: 50px;
          height: 50px;
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
          font-size: 12px;
          margin-top: 10px;
          text-transform: capitalize;
        }
      }
    }

    .scratch-all-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;
      background-color: $btn-primary-bg-color-LM;
      border-radius: $border-radius;
      border: none;
      margin-top: 30px;

      font-family: $bold;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;
    }
  }
}
</style>