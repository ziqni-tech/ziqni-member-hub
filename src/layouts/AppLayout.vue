<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import AppLayoutDefault from './AppLayoutDefault';
import { markRaw } from 'vue';
export default {
  name: 'AppLayout',
  data: () => ({
    layout: markRaw(AppLayoutDefault)
  }),
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          const component = await import(`@/layouts/${route.meta.layout}.vue`)

          this.layout = markRaw(component?.default) || markRaw(AppLayoutDefault)
        } catch (e) {
          this.layout = AppLayoutDefault
        }
      }
    }
  }
}
</script>