<template>
  <div class="message-details-card" :class="{'light-mode': !isDarkMode}">
    <div class="message-details-card_header">
      <div class="empty" v-if="!isMobile"></div>
      <div class="sender-name">
        <div class="avatar">
          <img src="@/assets/icons/messages/message-avatar.png" alt="">
        </div>
        <div class="name">{{ message.subject }}</div>
      </div>
      <div class="created">
        <span class="date">{{ formattedDate(message.created) }}</span>
        <span class="date">{{ formattedTime(message.created) }}</span>
      </div>
    </div>
    <div class="message-body" v-html="message.body"></div>
  </div>
</template>

<script setup>

import useMobileDevice from '@/hooks/useMobileDevice';

const props = defineProps({
  message: Object,
  isDarkMode: Boolean
});

const formattedDate = (dateString) => {
  const date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return `${ day }.${ month }.${ year }`;
};

const formattedTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${ hours }:${ minutes }`;
};

const { isMobile } = useMobileDevice();

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.message-details-card {
  max-width: 840px;
  margin: auto;
  background: $light-grey;
  height: 500px;
  border-radius: $border-radius;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 74px 33px;

  &_header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .empty,
    .created,
    .sender-name {
      flex-basis: 0;
      flex-grow: 1;
    }

    .sender-name {
      display: flex;
      align-items: center;

      .name {
        font-size: 20px;
        font-family: $bold;
        margin-left: 14px;
      }
    }

    .created {
      display: flex;
      font-size: 12px;
      font-family: $medium;
      justify-content: flex-end;

      .date {
        text-align: right;

        &:last-child {
          margin-left: 7px;
        }
      }
    }
  }

  .message-body {
    width: 100%;
    text-align: start;
    font-size: 14px;
  }

  &.light-mode {
    background: $card-bg-LM;

    .message-details-card_header {

      .empty,
      .created,
      .sender-name {
        flex-basis: 0;
        flex-grow: 1;
      }

      .sender-name {
        display: flex;
        align-items: center;

        .name {
          font-size: 20px;
          font-family: $bold;
          color: $section-title-color-LM;
          margin-left: 14px;
        }
      }

      .created {
        font-size: 12px;
        font-family: $medium;
        color: $card-title-color-LM;


        .date {
          text-align: right;

          &:last-child {
            margin-left: 7px;
          }
        }
      }
    }

    .message-body {
      width: 100%;
      text-align: start;
      font-size: 14px;
      font-family: $mainFont;
      color: $card-title-color-LM;
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .message-details-card {
    height: auto;
    padding: 11px 16px 13px;

    &_header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0;

      .sender-name {
        display: flex;
        align-items: center;

        .name {
          font-size: 16px;
          margin-left: 14px;
        }
      }

      .created {
        display: flex;
        flex-direction: column;
        font-size: 10px;

        .date {
          text-align: right;

          &:last-child {
            margin-left: 5px;
          }
        }
      }
    }

    .message-body {
      text-align: start;
      font-size: 16px;
    }
  }
}
</style>