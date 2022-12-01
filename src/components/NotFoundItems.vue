<template>
<div class="not-found-items">
  <span>Currently there are no {{ title }}</span>
</div>
</template>

<script>
export default {
  name: 'NotFoundItems',
  props: {
    title: String
  }
};
</script>

<style lang="scss">
.not-found-items {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;
  color: #5F6165;
}
</style>