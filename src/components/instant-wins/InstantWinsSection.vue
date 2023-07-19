<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header" >
      <h2 class="section-title" v-if="isDashboard">Instant wins</h2>
    </div>
    <div class="instant-cards-grid">
      <InstantWins
          :img="wheelImg"
          :title="singleWheelTitle"
          :description="description"
          @play="singleWheelPlay"
          :isDarkMode="isDarkMode"
      />
      <InstantWins
          :img="scratchcardImg"
          :title="scratchcardsTitle"
          :description="description"
          @play="scratchcardsPlay"
          :isDarkMode="isDarkMode"
      />
    </div>
  </div>
</template>

<script setup>
import InstantWins from './InstantWinsCard';
import singleWheelImg from '@/assets/images/instant-wins/single-wheel.png'
import singleWheelImgLight from '@/assets/images/instant-wins/single-wheel_light.png'
import scratchcardsImg from '@/assets/images/instant-wins/scratchcard.png'
import scratchcardsImgLight from '@/assets/images/instant-wins/scratchcard_light.png'
import { useRouter } from 'vue-router';
import { computed } from "vue";
import { useStore } from "vuex";

const singleWheelTitle = 'The Single Wheel'
const scratchcardsTitle = 'Scratchcards'
const description = 'Short description about this instant wins'

const wheelImg = computed(() => isDarkMode.value ? singleWheelImg : singleWheelImgLight);
const scratchcardImg = computed(() => isDarkMode.value ? scratchcardsImg : scratchcardsImgLight);

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
})

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const router = useRouter()

const singleWheelPlay = () => {
  router.push({
    name: 'SingleWheel'
  })
}

const scratchcardsPlay = () => {
  router.push({
    name: 'Scratchcards'
  })
}

</script>

<style lang="scss">
@import '@/assets/scss/_variables';
.section {
  .instant-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 15px;
  }

  &.light-mode {
    .section-header {
      .section-title {
        color: $section-title-color-LM;
      }
    }
  }
}

</style>