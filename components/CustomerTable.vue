<template>
  <section class="panel table-panel">
    <div v-if="customers.length" class="table-scroll">
      <table class="customers-table">
        <thead>
          <tr>
            <th class="col-index">#</th>
            <th>{{ $t('Customer name') }}</th>
            <th>{{ $t('Emirate') }}</th>
            <th>{{ $t('Activity') }}</th>
            <th>{{ $t('Phone') }}</th>
            <th>{{ $t('Website status') }}</th>
            <th>{{ $t('Sales opportunity') }}</th>
            <th class="col-actions">{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customers" :key="customer.id">
            <td class="col-index">{{ rowOffset + index + 1 }}</td>
            <td class="col-name">{{ customerValue(customer, 'name') }}</td>
            <td>{{ customerValue(customer, 'emirate') || $t('No value') }}</td>
            <td>{{ customerValue(customer, 'activity') || $t('No value') }}</td>
            <td class="col-phone" dir="ltr">{{ customer.phone || $t('No value') }}</td>
            <td>{{ customerValue(customer, 'website') || $t('No value') }}</td>
            <td>{{ customerValue(customer, 'opportunity') || $t('No value') }}</td>
            <td class="actions-cell">
              <div class="row-actions">
                <button class="icon-button" type="button" :aria-label="$t('View')" :title="$t('View')" @click="$emit('view', customer)">
                  <v-icon small>mdi-eye-outline</v-icon>
                </button>
                <button class="icon-button" type="button" :aria-label="$t('Edit')" :title="$t('Edit')" @click="$emit('edit', customer)">
                  <v-icon small>mdi-pencil-outline</v-icon>
                </button>
                <button class="icon-button danger" type="button" :aria-label="$t('Delete')" :title="$t('Delete')" @click="$emit('delete', customer)">
                  <v-icon small>mdi-delete-outline</v-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-state">
      <v-icon large>mdi-account-off-outline</v-icon>
      <p class="empty-state__message">{{ $t('No Data') }}</p>
      <button v-if="hasActiveFilters" class="button button-outline empty-state__reset" type="button" @click="$emit('reset-filters')">
        {{ $t('Reset Filters') }}
      </button>
    </div>
    <p v-if="customers.length" class="table-scroll-hint">
      <v-icon small>mdi-swap-horizontal</v-icon>
      {{ $t('Scroll to view all columns') }}
    </p>
  </section>
</template>

<script>
import { getCustomerValue } from '~/utils/customerData'

export default {
  name: 'CustomerTable',
  props: {
    customers: { type: Array, required: true },
    rowOffset: { type: Number, default: 0 },
    hasActiveFilters: { type: Boolean, default: false },
  },
  methods: {
    customerValue(customer, field) {
      return getCustomerValue(customer, field, this.$i18n.locale)
    },
  },
}
</script>
