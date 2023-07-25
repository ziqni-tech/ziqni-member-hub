<template>
  <div class="instant-wins-card" :class="{'light-mode': !isDarkMode}">
    <h3 class="mobile-card-title">{{ title }}</h3>
    <div class="instant-img-wrapper">
      <img class="instant-img" :src="img" alt="" />
    </div>
    <div class="instant-info">
      <h3 class="card-title">{{ title }}</h3>
      <span class="card-description">{{ description }}</span>
      <button class="play-btn" @click="play">Play</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  img: String,
  isDarkMode: Boolean
});

const emit = defineEmits(['play'])
const play = () => {
  emit('play')
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.instant-wins-card {
  display: flex;
  padding: 10px;
  border-radius: $border-radius;
  background-color: $card-bg-DM;

  width: 100%;
  height: auto;
  aspect-ratio: 3 / 1;
  font-family: $semi-bold;

  .mobile-card-title {
    display: none;
  }

  .instant-img-wrapper {
    width: 44%;
    height: 100%;
    background-color: $prize-btn-bg-DM;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;

    .instant-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .instant-info {
    display: flex;
    flex-direction: column;
    width: 56%;
    height: 100%;
    padding: 6px 16px 0;

    .card-title {
      font-size: 14px;
      font-family: $bold;
      color: $white-color-DM;
      text-align: start;
    }

    .card-description {
      font-size: 12px;
      color: $description-color-DM;
      font-family: $mainFont;
      text-align: start;
      margin-top: 10px;
    }

    .play-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $btn-primary-bg-color-LM;
      border-radius: $border-radius;
      border: 1px solid $btn-border-color-LM;

      font-size: 14px;
      font-family: $bold;
      color: $text-color-white;

      margin-top: auto;
      max-width: 124px;
    }
  }

  &.light-mode {
    background-color: $card-bg-LM;

    .mobile-card-title {
      display: none;
    }

    .instant-img-wrapper {
      width: 44%;
      height: 100%;
      background-color: $bg-body-LM;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;

      .instant-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .instant-info {
      display: flex;
      flex-direction: column;
      width: 56%;
      height: 100%;
      padding: 6px 16px 0;

      .card-title {
        font-size: 14px;
        color: $card-title-color-LM;
      }

      .card-description {
        font-size: 12px;
        color: $card-text-color-LM;
        margin-top: 10px;
      }

      .play-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 57px;

        background: $btn-primary-bg-color-LM;
        border-radius: $border-radius;
        border: 1px solid $btn-border-color-LM;

        font-size: 14px;
        font-family: $bold;
        color: $white-color-DM;

        margin-top: auto;
        max-width: 124px;
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .instant-wins-card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: $border-radius;
    background-color: $card-bg-DM;

    width: 100%;

    .mobile-card-title {
      display: flex;
      width: 100%;
      justify-content: center;
      padding-bottom: 15px;
      font-size: 12px;
      font-family: $bold;
      color: $white-color-DM;
    }

    .instant-img-wrapper {
      width: 100%;
      background-color: $prize-btn-bg-DM;
      border-radius: $border-radius;
      padding-bottom: 75%;
      position: relative;
      overflow: hidden;

      .instant-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .instant-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0;

      .card-title {
        display: none;
      }

      .card-description {
        display: none;
      }

      .play-btn {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 6px;

        font-family: $bold;;
        font-size: 12px;
        line-height: 14px;
        color: $white-color-DM;

        margin-top: auto;
      }
    }
    &.light-mode {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-radius: $border-radius;
      width: 100%;

      .mobile-card-title {
        display: flex;
        width: 100%;
        justify-content: center;
        padding-bottom: 15px;
        font-size: 14px;
        color: $section-title-color-LM;
      }

      .instant-img-wrapper {
        width: 100%;
        border-radius: $border-radius;
        padding-bottom: 75%;
        position: relative;
        overflow: hidden;

        .instant-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .instant-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 0;

        .card-title {
          display: none;
        }

        .card-description {
          display: none;
        }

        .play-btn {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: 6px;

          border-radius: $border-radius;

          font-family: $bold;;
          font-size: 12px;
          line-height: 14px;
          color: $text-color-white;

          margin-top: auto;
        }
      }
    }
  }
}
</style>