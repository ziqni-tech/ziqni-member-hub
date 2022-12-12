<template>
  <div class="leader-board__item" :class="setItemBgColor">
    <div class="item_player">
      <Avatar :place="place" />
      <div class="item_player__name-block" :style="{'--color': place < 4 ? '#43360E' : '#ffffff' }">
        <span v-for="member in leaderboardItem?.members">
          {{ member.name }}
        </span>
      </div>
    </div>
    <span class="tournaments-played" :style="{'--color': place < 4 ? '#43360E' : '#ffffff' }">10</span>
    <div class="earnings-wrapper">
      <div class="earnings" :class="setEarningsBgColor">{{ leaderboardItem?.score }}</div>
    </div>
  </div>
</template>

<script setup>
import Avatar from '../../shared/components/Avatar';
import { computed } from 'vue';
const props = defineProps({ item: Object, idx: Number });
const leaderboardItem = props.item;
const place = props.idx + 1;

// {rank: 1, score: 626.5, bestScores: null, members: Array(1)}
const setItemBgColor = computed(() => {
  switch (place) {
    case 1:
      return  'gold';
    case 2:
      return  'grey';
    case 3:
      return  'bronze';
    default:
      return  'default'
  }
})

const setEarningsBgColor = computed(() => {
  if (place < 4) {
    return  'purple';
  } else {
    return  'orange';
  }
})

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
.purple {
  background: $primary-color;
}
.orange {
  background: $danger-color ;
}
.leader-board__item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 8px;
  padding: 7px 8px;
  margin-bottom: 30px;

  .item_player {
    display: flex;
    justify-content: flex-start;
    width: 33%;

    &__name-block {
      display: flex;
      flex-direction: column;
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
      max-height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 19px;
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
@media screen and (max-width: $desktopWidth) {
  .leader-board__item {
    margin-bottom: 10px;
    width: 100%;

    .item_player {
      &__name-block {
        font-size: 14px;
        padding: 0 0 0 5px;
        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .tournaments-played {
      font-size: 14px;
      line-height: 17px;
    }
    .earnings-wrapper {
      display: flex;
      justify-content: flex-end;

      .earnings {
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
}
</style>