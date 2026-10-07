<template>
  <section class="panel filters-panel">
    <div class="filters-grid">
      <labeled-field class="field filters-grid__search" :label="$t('Search')" for-id="customer-search">
        <v-text-field
          id="customer-search"
          :value="value.search"
          dense outlined hide-details clearable
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('Search by name or phone')"
          @input="updateFilter('search', $event)"
          @keyup.enter="$emit('apply')"
          @click:clear="$emit('apply')"
        />
      </labeled-field>
      <labeled-field v-for="field in filterFields" :key="field.key" class="field" :label="$t(field.label)" :for-id="'filter-' + field.key">
        <v-select
          :id="'filter-' + field.key"
          :value="value[field.key]"
          :items="filterOptions[field.key]"
          item-text="text"
          item-value="value"
          dense outlined hide-details clearable
          :menu-props="{ offsetY: true }"
          @input="updateFilter(field.key, $event)"
          @keyup.enter="$emit('apply')"
          @click:clear="$emit('apply')"
        />
      </labeled-field>
      <div class="filters-grid__actions">
        <button class="button button-primary btn-search" type="button" @click="$emit('apply')">
          <v-icon small left>mdi-magnify</v-icon>{{ $t('Search') }}
        </button>
        <button class="button button-outline btn-reset" type="button" @click="$emit('reset')">{{ $t('Reset Filters') }}</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CustomerFilters',
  props: {
    value: { type: Object, required: true },
    filterFields: { type: Array, required: true },
    filterOptions: { type: Object, required: true },
  },
  methods: {
    updateFilter(key, value) {
      this.$emit('input', { ...this.value, [key]: value || '' })
    },
  },
}
</script>
