<template>
  <div class="countdown">
    <div class="indicator">
      <div class="indicator-block">
        <div class="indicator-block_digits">
            <span class="indicator-block_digits__digit">
            {{ days[0] }}
          </span>
          <span class="indicator-block_digits__digit">
            {{ days[1] }}
          </span>
        </div>
        <div class="indicator-block_text">Days</div>
      </div>
      <div class="indicator-block">
        <div class="indicator-block_digits">
            <span class="indicator-block_digits__digit">
            {{ hours[0] }}
          </span>
          <span class="indicator-block_digits__digit">
            {{ hours[1] }}
          </span>
        </div>
        <div class="indicator-block_text">Hours</div>
      </div>

      <div class="indicator-block">
        <div class="indicator-block_digits">
            <span class="indicator-block_digits__digit">
            {{ minutes[0] }}
          </span>
          <span class="indicator-block_digits__digit">
            {{ minutes[1] }}
          </span>
        </div>
        <div class="indicator-block_text">Minutes</div>
      </div>

      <div class="indicator-block">
        <div class="indicator-block_digits">
            <span class="indicator-block_digits__digit">
            {{ seconds[0] }}
          </span>
          <span class="indicator-block_digits__digit">
            {{ seconds[1] }}
          </span>
        </div>
        <div class="indicator-block_text">Seconds</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Countdown',
  props: {
    date: {
      type: String,
      default: '2023-01-01T00:00:00'
    },
  },
  data() {
    return {
      now: Math.trunc((new Date()).getTime() / 1000),
      event: this.date,
      finish: false
    };
  },
  mounted() {
    const _self = this;
    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
      if (!this.finish && this.calculatedDate - this.now <= 0) {
        _self.finish = true;
        _self.$emit('onFinish');
      }
    }, 1000);
  },
  computed: {
    secondCount() {
      return this.calculatedDate - this.now;
    },
    calculatedDate() {
      return Math.trunc(Date.parse(this.date) / 1000);
    },
    seconds() {
      if (this.secondCount < 0) return 0;
      return this.twoDigits(this.secondCount % 60);
    },
    minutes() {
      if (this.secondCount < 0) return 0;
      return this.twoDigits(Math.trunc(this.secondCount / 60) % 60);
    },
    hours() {
      if (this.secondCount < 0) return 0;
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60) % 24);
    },
    days() {
      if (this.secondCount < 0) return 0;
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60 / 24));
    },
  },
  methods: {
    twoDigits(value) {
      if (isNaN(value)) {
        return '00';
      }
      if (value.toString().length <= 1) {
        return '0' + value.toString();
      }

      return value.toString().split('');
    }
  },
};
</script>
<style lang="scss">
@import '../assets/scss/_variables';

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: $main-text-color-white;

  .indicator {
    display: flex;

    .indicator-block {
      display: flex;
      flex-direction: column;
      margin-right: 20px;

      &_digits {
        display: flex;
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;

        &__digit {
          width: 33px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid $purple-light;
          border-radius: $border-radius-sm;

          &:first-child {
            margin-right: 5px;
          }
        }
      }

      &_text {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        margin-top: 5px;
      }
    }
  }
}
</style>