<template>
  <div class="page-container">
    <CImage class="banner" rounded :src="$options.banner" />
  </div>
</template>

<script>
import { CImage } from '@coreui/vue';
import banner from '../assets/images/banner.png';
export default {
  name: 'TournamentDetails',
  banner,
  components: {
    CImage
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;

  .banner {
    width: 100%;
  }
}
</style>