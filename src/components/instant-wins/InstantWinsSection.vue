<template>
  <div class="section">
    <div class="section-header" >
      <h2 class="section-title" v-if="isDashboard">Instant wins</h2>
    </div>
    <div class="instant-cards-grid">
      <InstantWins
          :img="singleWheelImg"
          :title="singleWheelTitle"
          :description="description"
          @play="singleWheelPlay"
      />
      <InstantWins
          :img="scratchcardsImg"
          :title="scratchcardsTitle"
          :description="description"
          @play="scratchcardsPlay"
      />
    </div>
  </div>
</template>

<script setup>
import InstantWins from './InstantWinsCard';
import singleWheelImg from '@/assets/images/instant-wins/single-wheel.png'
import scratchcardsImg from '@/assets/images/instant-wins/scratchcards.png'
import { useRouter } from 'vue-router';

const singleWheelTitle = 'The Single Wheel'
const scratchcardsTitle = 'Scratchcards'
const description = 'Short description about this instant wins'

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
})

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
.instant-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;
}
</style>