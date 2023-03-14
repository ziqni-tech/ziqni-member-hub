<template>
  <div class="welcome">Hello, {{ name }}</div>
</template>

<script>
export default {
  name: 'Welcome',
  props: {
    name: String
  }
};
</script>

<style lang="scss">
.welcome {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;

  text-transform: capitalize;

  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>