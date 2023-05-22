<template>
  <div class="table-pagination">
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

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
});

const emit = defineEmits(['pageChang']);

const pageNumbers = computed(() => {
  const { totalPages, currentPage } = props;
  const maxVisiblePages = 7;
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
    emit('pageChang', props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage < props.totalPages) {
    emit('pageChang', props.currentPage + 1);
  }
}

function changePage(pageNumber) {
  if (pageNumber !== props.currentPage) {
    emit('pageChang', pageNumber);
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.table-pagination {
  display: flex;
  align-items: center;
  width: 100%;

  .page-item {
    margin: 0 3px;
    border: 1px solid #333333;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $main-text-color-white;
    border-radius: $border-radius-sm;
    background-color: $light-grey;

  }

  .active {
    background-color: $purple;
  }

  button[disabled] {
    cursor: not-allowed;
  }
}

</style>