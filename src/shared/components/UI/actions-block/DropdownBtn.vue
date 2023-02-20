<template>
  <CDropdown>
    <CDropdownToggle class="dd-btn">{{ btnTitle }}</CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem href="#">Action</CDropdownItem>
      <CDropdownItem href="#">Another action</CDropdownItem>
      <CDropdownItem href="#">Something else here</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue';

const props = defineProps({ btnTitle: String });
</script>

<style lang="scss">

</style>