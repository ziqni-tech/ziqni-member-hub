<template>
  <div class="leader-board__item">
    <div class="item_player">
      <Avatar />
      <span class="item_player__name">sebastianpozzo</span>
    </div>
    <span class="tournaments-played">10</span>
    <div class="earnings-wrapper">
      <div class="earnings">$66127</div>
    </div>
  </div>
</template>

<script>
import Avatar from '../../shared/components/Avatar';
export default {
  name: 'LeaderboardItem',
  components: {
    Avatar
  }
};
</script>

<style lang="scss">
.leader-board__item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(220, 195, 21, 0.9) 0%, rgba(255, 223, 0, 0.9) 100%);
  border-radius: 8px;
  padding: 7px 8px;
  margin-bottom: 30px;

  .item_player {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 33%;

    &__name {
      padding-left: 40px;
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 27px;
      color: #43360E;
    }
  }

  .tournaments-played {
    width: 33%;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: #43360E;
  }

  .earnings-wrapper {
    width: 33%;
    display: flex;
    justify-content: flex-end;

    .earnings {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 117px;
      height: 37px;
      background: #5D53C2;
      border-radius: 8px;

      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 32px;
      text-align: center;
      color: #FFFFFF;
    }
  }
}
</style>