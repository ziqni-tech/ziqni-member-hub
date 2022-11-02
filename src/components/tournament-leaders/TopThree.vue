<template>
  <div class="top-three">
    <div class="leaders">
      <LeaderItem :place="'second'" />
      <LeaderItem :place="'first'" />
      <LeaderItem :place="'third'" />
    </div>
  </div>
</template>

<script>
import LeaderItem from './LeaderItem';
export default {
  name: 'TopThree',
  components: {
    LeaderItem
  }
};
</script>

<style lang="scss">
.top-three {
  width: 390px;
  height: 439px;
  background: #5D53C2;
  box-shadow: 0px 7.54749px 22.6425px rgba(179, 179, 179, 0.25);
  border-radius: 6px;
  margin-left: 30px;
  padding: 115px 46px;

  .leaders {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>