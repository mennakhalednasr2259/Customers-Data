<template>
  <nav v-if="lastPage > 1" class="pager" :aria-label="$t('Pagination')">
    <div class="pager__meta">{{ $t('Page') }} {{ currentPage }} / {{ lastPage }}</div>
    <div class="pager__controls" dir="ltr">
      <button class="pager__nav" type="button" :disabled="currentPage <= 1" :aria-label="$t('Previous')" @click="$emit('page-change', currentPage - 1)">
        <v-icon small>mdi-chevron-left</v-icon>
      </button>
      <button
        v-for="(pageNumber, index) in visiblePages"
        :key="String(pageNumber) + '-' + index"
        class="pager__item"
        :class="{ 'pager__item--active': pageNumber === currentPage, 'pager__item--ellipsis': pageNumber === '...' }"
        type="button"
        :disabled="pageNumber === '...'"
        :aria-current="pageNumber === currentPage ? 'page' : null"
        @click="pageNumber !== '...' && $emit('page-change', pageNumber)"
      >{{ pageNumber }}</button>
      <button class="pager__nav" type="button" :disabled="currentPage >= lastPage" :aria-label="$t('Next')" @click="$emit('page-change', currentPage + 1)">
        <v-icon small>mdi-chevron-right</v-icon>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CustomerPagination',
  props: {
    currentPage: { type: Number, required: true },
    lastPage: { type: Number, required: true },
    visiblePages: { type: Array, required: true },
  },
}
</script>
