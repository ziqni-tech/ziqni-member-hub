<template>
  <div class="leader-board__item" :class="setItemBgColor()">
    <div class="item_player">
      <Avatar :place="itemPLace" />
      <span class="item_player__name" :style="{'--color': itemPLace < 4 ? '#43360E' : '#ffffff' }">sebastianpozzo</span>
    </div>
    <span class="tournaments-played" :style="{'--color': itemPLace < 4 ? '#43360E' : '#ffffff' }">10</span>
    <div class="earnings-wrapper">
      <div class="earnings" :class="setEarningsBgColor()">$66127</div>
    </div>
  </div>
</template>

<script>
import Avatar from '../../shared/components/Avatar';
export default {
  name: 'LeaderboardItem',
  components: {
    Avatar
  },
  data() {
    return {
      itemPLace: null
    }
  },
  props: {
    place: Number
  },
  created() {
    this.itemPLace = this.place;
  },
  methods: {
    setItemBgColor() {
      switch (this.itemPLace) {
        case 1:
          return 'gold';
        case 2:
          return 'grey';
        case 3:
          return 'bronze';
        default:
          return 'default'
      }
    },
    setEarningsBgColor() {
      if (this.itemPLace < 4) {
        return 'default'
      } else {
        return 'orange'
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.gold {
  width: 100%;
  background: $gold-gradient ;
}
.grey {
  width: 100%;
  background: $silver-gradient ;
}
.bronze {
  width: 100%;
  background: $bronze-gradient;
}
.default {
  width: 97%;
  background: $primary-color;
}
.orange {
  background: $danger-color ;
}
.leader-board__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      font-family: $mainFont;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 27px;
      color: var(--color);
    }
  }

  .tournaments-played {
    width: 33%;
    font-family: $mainFont;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: var(--color);
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
      border-radius: 8px;

      font-family: $mainFont;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 32px;
      text-align: center;
      color: $g-0;
    }
  }
}
</style>