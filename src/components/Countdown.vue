<template>
  <div>
    <span class="title">ENDS IN</span>
    <div class="countdown">
      <div v-if="days" class="countdown__block">
        <div class="countdown__digit">{{ days }}</div>
        <div class="countdown__text">Days</div>
      </div>
      <div class="countdown__block">
        <div class="countdown__digit">{{ hours }}</div>
        <div class="countdown__text">Hours</div>
      </div>
      <div class="countdown__block">
        <div class="countdown__digit">{{ minutes }}</div>
        <div class="countdown__text">Mins</div>
      </div>
      <div class="countdown__block">
        <div class="countdown__digit">{{ seconds }}</div>
        <div class="countdown__text">Secs</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Countdown',
  props: {
    date: null
  },
  data () {
    return {
      now: Math.trunc((new Date()).getTime() / 1000),
      event: this.date,
      finish: false
    }
  },
  mounted () {
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
    secondCount () {
      return this.calculatedDate - this.now
    },
    calculatedDate () {
      return Math.trunc(Date.parse(this.event) / 1000)
    },
    seconds () {
      if (this.secondCount < 0) return 0
      return this.twoDigits(this.secondCount % 60)
    },
    minutes () {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60) % 60)
    },
    hours () {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60) % 24)
    },
    days () {
      if (this.secondCount < 0) return 0
      return this.twoDigits(Math.trunc(this.secondCount / 60 / 60 / 24))
    },
  },
  methods: {
    twoDigits (value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
}
</script>
<style lang="scss">
.title {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 33px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}
.countdown{
  display: flex;
  justify-content: center;
  &__block {
    text-align: center;
    padding: 0 9px;
    position: relative;
    &:first-child{
      padding-left: 0;
      .countdown__digit{
        &:before{
          display: none;
        }
      }
    }
    &:last-child{
      padding-right: 0;
    }
  }
  &__text {
    text-transform: capitalize;
    margin-bottom: 5px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 12.5863px;
    line-height: 27px;
    text-align: center;


  }
  &__digit {
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    margin-bottom: 5px;
    //&:before{
    //  content: ":";
    //  position: absolute;
    //  left: -5px;
    //}
  }
}
</style>