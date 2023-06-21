<template>
  <div class="message-details-card">
    <div class="message-details-card_header">
      <div class="empty"></div>
      <div class="sender-name">
        <div class="avatar">
          <img src="@/assets/icons/messages/message-avatar.png" alt="">
        </div>
        <div class="name">sender-name</div>
      </div>
      <div class="created">
        <span class="date">{{ formattedDate(message.created) }}</span>
        <span class="date">{{ formattedTime(message.created) }}</span>
      </div>
    </div>
    <div class="message-body">
      {{ message.body }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  message: Object
})

const formattedDate = (dateString) => {
  const date = new Date(dateString)
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return `${day}.${month}.${year}`
}

const formattedTime = (dateString) => {
  const date = new Date(dateString)
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`
}

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
  color: $body-text-white;

  &_header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .sender-name {
      display: flex;
      align-items: center;

      .name {
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        margin-left: 14px;
      }
    }

    .created {
      display: flex;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;

      .date {
        text-align: right;

        &:last-child {
          margin-left: 7px;
        }
      }
    }
  }

  .message-body {
    text-align: start;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
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

      .sender-name {
        display: flex;
        align-items: center;

        .name {
          font-weight: 700;
          font-size: 14px;
          line-height: 17px;
          margin-left: 14px;
        }
      }

      .created {
        display: flex;
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;

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
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
    }
  }
}
</style>