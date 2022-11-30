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

<script>
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/vue';
export default {
  name: 'DropdownBtn',
  components: {
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
  },
  props: {
    btnTitle: String
  }
};
</script>

<style lang="scss">

</style>