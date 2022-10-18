<template>
  <div class="notifications">
    <div class="icon-wrapper">
      <img class="icon" src="../../assets/icons/bell-icon.svg" alt="">
    </div>
    <span class="number-of-notifications">{{numberOfNotifications}}</span>
  </div>
</template>

<script>


export default {
  name: 'Notifications',
  props: {
    numberOfNotifications: Number
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.notifications {
  display: flex;
  align-items: center;

  .icon-wrapper {
    width: 25px;
    height: 25px;
    object-fit: cover;
    overflow: hidden;

    .icon {
      width: 100%;
      height: 100%;
    }
  }

  .number-of-notifications {
    padding: 0 6px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 10px;
    color: $nav-text-color;
  }
}

</style>