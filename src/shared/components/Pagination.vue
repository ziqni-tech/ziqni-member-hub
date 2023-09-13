<template>
  <div
      class="table-pagination"
      :class="{'light-mode': !isDarkMode}"
      v-if="totalPages > 1"
  >
    <button
        class="page-item"
        @click="prevPage"
        :disabled="currentPage === 1"
    >
      &lt;
    </button>
    <button
        class="page-item"
        v-for="(pageNumber, index) in pageNumbers"
        :key="index"
        :class="{active: pageNumber === currentPage}"
        @click="changePage(pageNumber)"
    >
      {{ pageNumber }}
    </button>
    <button
        class="page-item"
        @click="nextPage"
        :disabled="currentPage === totalPages"
    >
      >
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {useStore} from "vuex";

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
});

const emit = defineEmits(['pageChange']);

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const pageNumbers = computed(() => {
  const { totalPages, currentPage } = props;
  const maxVisiblePages = 5;
  const pageOffset = Math.floor(maxVisiblePages / 2);
  const pageNumbers = [];

  let startPage = currentPage - pageOffset;
  let endPage = currentPage + pageOffset;

  if (startPage <= 0) {
    startPage = 1;
    endPage = Math.min(maxVisiblePages, totalPages);
  } else if (endPage > totalPages) {
    startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
    endPage = totalPages;
  }

  if (startPage > 1) {
    pageNumbers.push(1);
    if (startPage > 2) {
      pageNumbers.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
});

function prevPage() {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage < props.totalPages) {
    emit('pageChange', props.currentPage + 1);
  }
}

function changePage(pageNumber) {
  if (pageNumber !== props.currentPage) {
    emit('pageChange', pageNumber);
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: auto;
  padding-bottom: 15px;
  font-family: $bold;
  font-size: 12px;

  .page-item {
    margin: 0 3px;
    border: 1px solid $btn-border-color-LM;
    width: 55px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $bold;
    font-size: 12px;
    color: $white-color-DM;
    border-radius: $border-radius-sm;
    background: none;
  }

  .active {
    background: $btn-primary-bg-color-LM;
    border: 1px solid $btn-border-color-LM;
  }

  button[disabled] {
    cursor: not-allowed;
  }

  &.light-mode {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: auto;
    padding-bottom: 15px;
    font-family: $bold;
    font-size: 12px;

    .page-item {
      margin: 0 3px;
      border: 1px solid $pagination-btn-border;
      width: 55px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $btn-secondary-color-LM;
      border-radius: $border-radius-sm;
      background-color: $btn-primary-color-LM;
    }

    .active {
      background: $pagination-active-btn-bg;
      border: 1px solid $pagination-active-btn-bg;
      color: white;
    }

    button[disabled] {
      cursor: not-allowed;
    }
  }
}

</style>