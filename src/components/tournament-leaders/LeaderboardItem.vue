<template>
  <div class="leader-board__item" :class="setItemBgColor()">
    <div class="item_player">
      <Avatar :place="itemPLace" />
      <span class="item_player__name">sebastianpozzo</span>
    </div>
    <span class="tournaments-played">10</span>
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
.gold {
  width: 100%;
  background: linear-gradient(180deg, rgba(220, 195, 21, 0.9) 0%, rgba(255, 223, 0, 0.9) 100%);
}
.grey {
  width: 100%;
  background: linear-gradient(180deg, #DDDDDD 0%, #C3BABA 100%);
}
.bronze {
  width: 100%;
  background: linear-gradient(180deg, #F5C1A1 0%, rgba(245, 193, 161, 0.723958) 27.6%, #ECAB84 100%);
}
.default {
  width: 97%;
  background: #5D53C2;
}
.orange {
  background: #F6876A;
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