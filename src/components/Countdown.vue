<template>
  <div
    class="countdown"
    :class="{
      'display-row': isRow,
      'display-column': isColumn,
      'space-between': !isDetailCard
    }"
  >
    <span :class="{
      'title-big': isBigSize,
      'title-medium': isMediumSize,
      'title-small': isSmallSize,
      'title-x-small': isXSmallSize,
      'detail-card-title': isDetailCard,
    }">{{ title }}</span>
    <div class="indicator" :class="{
      'detail-card-indicator': isDetailCard,
      'space-between': !isDetailCard
    }">
      <div v-if="days" class="indicator__block">
        <div :class="{
          'indicator__digit-big-size': isBigSize,
          'indicator__digit-medium-size': isMediumSize,
          'indicator__digit-small-size': isSmallSize,
          'indicator__digit-x-small-size': isXSmallSize,
          'indicator__digit-detail-card': isDetailCard,
          }">{{ days }}</div>
        <div :class="{
          'indicator__text-big-size': isBigSize,
          'indicator__text-medium-size': isMediumSize,
          'indicator__text-small-size': isSmallSize,
          'indicator__text-x-small-size': isXSmallSize,
          'indicator__text-detail-card': isDetailCard,
          }"
        >Days</div>
      </div>
      <div class="indicator__block">
        <div :class="{
          'indicator__digit-big-size': isBigSize,
          'indicator__digit-medium-size': isMediumSize,
          'indicator__digit-small-size': isSmallSize,
          'indicator__digit-x-small-size': isXSmallSize,
          'indicator__digit-detail-card': isDetailCard,
          }"
        >{{ hours }}</div>
        <div :class="{
          'indicator__text-big-size': isBigSize,
          'indicator__text-medium-size': isMediumSize,
          'indicator__text-small-size': isSmallSize,
          'indicator__text-x-small-size': isXSmallSize,
          'indicator__text-detail-card': isDetailCard,
          }"
        >Hours</div>
      </div>
      <div class="indicator__block">
        <div :class="{
          'indicator__digit-big-size': isBigSize,
          'indicator__digit-medium-size': isMediumSize,
          'indicator__digit-small-size': isSmallSize,
          'indicator__digit-x-small-size': isXSmallSize,
          'indicator__digit-detail-card': isDetailCard,
          }"
        >{{ minutes }}</div>
        <div :class="{
          'indicator__text-big-size': isBigSize,
          'indicator__text-medium-size': isMediumSize,
          'indicator__text-small-size': isSmallSize,
          'indicator__text-x-small-size': isXSmallSize,
          'indicator__text-detail-card': isDetailCard,
          }"
        >Mins</div>
      </div>
      <div class="indicator__block">
        <div :class="{
          'indicator__digit-big-size': isBigSize,
          'indicator__digit-medium-size': isMediumSize,
          'indicator__digit-small-size': isSmallSize,
          'indicator__digit-x-small-size': isXSmallSize,
          'indicator__digit-detail-card': isDetailCard,
          }"
        >{{ seconds }}</div>
        <div :class="{
          'indicator__text-big-size': isBigSize,
          'indicator__text-medium-size': isMediumSize,
          'indicator__text-small-size': isSmallSize,
          'indicator__text-x-small-size': isXSmallSize,
          'indicator__text-detail-card': isDetailCard,
          }"
        >Secs</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Countdown',
  props: {
    date: null,
    title: String,
    isRow: {
      type: Boolean,
      default: false
    },
    isColumn: {
      type: Boolean,
      default: false
    },
    isBigSize: {
      type: Boolean,
      default: false
    },
    isMediumSize: {
      type: Boolean,
      default: false
    },
    isSmallSize: {
      type: Boolean,
      default: false
    },
    isXSmallSize: {
      type: Boolean,
      default: false
    },
    isDetailCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      now: Math.trunc((new Date()).getTime() / 1000),
      event: this.date,
      finish: false
    }
  },
  created() {
    console.log('props', this.isDetailCard);
  },
  mounted() {
    const _self = this
    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000)
      if (!this.finish && this.calculatedDate - this.now <= 0) {
        _self.finish = true
        _self.$emit('onFinish')
      }
    }, 1000)
  },
  computed: {
    secondCount() {
      return this.calculatedDate - this.now
    },
    calculatedDate() {
      return Math.trunc(Date.parse(this.event) / 1000)
    },
    seconds() {
      if (this.secondCount < 0) return 0
      return this.twoDigits(this.secondCount % 60)
    },
    minutes() {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60) % 60)
    },
    hours() {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60) % 24)
    },
    days() {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60 / 24))
    },
  },
  methods: {
    twoDigits(value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
}
</script>
<style lang="scss">
.countdown {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 5px;
}
.space-between {
  justify-content: space-between;
}
.display-row {
  flex-direction: row;
}
.display-column {
  flex-direction: column;
}

.detail-card-title {
  width: 55px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 18px;
  text-align: start;
  text-transform: uppercase;
  color: #FFFFFF;
}

.title-big {
  width: 50%;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 33px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

.title-medium {
  width: 30%;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 18px;
  color: #FFFFFF;
}
.title-small {
  width: 30%;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 12px;
  text-transform: uppercase;
  color: #FFFFFF;
}
.title-x-small {
  width: 30%;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 7px;
  line-height: 12px;
  text-transform: uppercase;
  color: #FFFFFF;
}
.detail-card-indicator {
  justify-content: flex-end;
  .indicator__block {
    margin-left: 18px;
  }
}
.indicator {
  display: flex;
  min-width: 50%;

  &__indicator {
    text-align: center;
    padding: 0 9px;
    position: relative;

    &__block {
      margin-left: 5px;
      &:first-child {
        margin-left: 0;
      }
    }

    &:first-child {
      padding-left: 0;

      .indicator__digit {
        &:before {
          display: none;
        }
      }
    }

    &:last-child {
      padding-right: 0;
    }
  }

  &__digit-detail-card {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 17.3286px;
    line-height: 18px;
    text-align: center;
    color: #FFFFFF;
  }
  &__text-detail-card {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 10.5897px;
    line-height: 23px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
  }
  &__text-big-size {
    text-transform: capitalize;
    margin-bottom: 5px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 27px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
  }
  &__digit-big-size {
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    margin-bottom: 5px;
    color: rgba(255, 255, 255, 0.6);
  }

  &__text-medium-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.6);;
  }
  &__digit-medium-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 18px;
    color: #FFFFFF;
  }

  &__text-small-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 7px;
    line-height: 15px;
    color: #FFFFFF;
  }
  &__digit-small-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 12px;
    color: #FFFFFF;
  }

  &__text-x-small-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 5px;
    line-height: 6px;
    color: #FFFFFF;
  }
  &__digit-x-small-size {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 8px;
    line-height: 12px;
    color: #FFFFFF;
  }
}
</style>