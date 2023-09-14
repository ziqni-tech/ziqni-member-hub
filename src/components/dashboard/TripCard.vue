<template>
  <div class="trip-card">
    <div class="date-time">
      <div class="date">Today, 03:40 pm</div>
      <div class="time">23 minutes</div>
    </div>
    <ul class="addresses">
      <li class="address">
        First address
      </li>
      <li class="address">
        Second address
      </li>
      <li class="address">
        Third address
      </li>
    </ul>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.trip-card {
  border-radius: 8px;
  background: #EFF2F6;
  display: flex;
  flex-direction: column;
  padding: 10px 8px;
  position: relative;

  .address {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    color: #253241;
    padding-left: 8px;

    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    position: relative;
  }

  ul.addresses li:after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #A4E1F4;
    position: absolute;
    left: 0;
    top: 35%;
  }

  ul.addresses li:before {
    content:"";
    position: absolute;
    left: 1.5px;
    top: 35%;
    border-left: 1px dashed #A4E1F4;
    height: 35px;
    width: 1px;
  }

  ul.addresses li:first-child:before {
    top: 6px;
  }

  ul.addresses li:last-child:before {
    content:"";
    position: absolute;
    height: 0;
    width: 0;
    border-left: 0 dashed #A4E1F4;
  }

  .date-time {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .date {
      color: #202B38;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      margin-right: 20px;
      min-width: 90px;
    }

    .time {
      min-width: 60px;
      color: #199EC7;
      text-align: right;

      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>