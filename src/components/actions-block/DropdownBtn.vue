<template>
  <CDropdown>
    <CDropdownToggle class="dropdown-btn">{{ btnTitle }}</CDropdownToggle>
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
.dropdown-btn {
  background: #F6876A;
  color: #FFFFFF;

  &::after {
    margin-left: 28px;
  }
}
</style>