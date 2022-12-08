<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="float-left display-3 mr-4">404</h1>
      <h4 class="pt-3">Oops! You're lost.</h4>
      <p class="text-muted">The page you are looking for was not found.</p>
    </div>

  </div>

</template>

<script>
export default {
  name: 'Page404'
};
</script>

<style lang="scss">
.not-found {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;

  &__content {
    position: absolute;
    top: 35%;
  }
}
</style>