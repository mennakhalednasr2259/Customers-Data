<template>
  <v-dialog :value="value" max-width="640" @input="$emit('input', $event)">
    <v-card v-if="customer" class="modal">
      <header class="modal-header">
        <h2>{{ $t('Customer details') }}</h2>
        <button class="icon-button" type="button" :aria-label="$t('Close')" @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </button>
      </header>
      <dl class="details-grid">
        <div v-for="field in detailFields" :key="field.key" class="detail-item">
          <dt>{{ $t(field.label) }}</dt>
          <dd :dir="field.key === 'phone' ? 'ltr' : null">{{ detailValue(field.key) }}</dd>
        </div>
      </dl>
      <footer class="modal-actions">
        <button class="button button-outline" type="button" @click="$emit('input', false)">{{ $t('Close') }}</button>
        <button class="button button-primary" type="button" @click="$emit('edit', customer)">{{ $t('Edit') }}</button>
      </footer>
    </v-card>
  </v-dialog>
</template>

<script>
import { getCustomerValue } from '~/utils/customerData'

export default {
  name: 'CustomerDetailsDialog',
  props: {
    value: { type: Boolean, default: false },
    customer: { type: Object, default: null },
  },
  data() {
    return {
      detailFields: [
        { key: 'name', label: 'Customer name' },
        { key: 'emirate', label: 'Emirate' },
        { key: 'activity', label: 'Activity' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website status' },
        { key: 'opportunity', label: 'Sales opportunity' },
        { key: 'createdBy', label: 'Created by' },
        { key: 'updatedBy', label: 'Updated by' },
        { key: 'createdAt', label: 'Created at' },
        { key: 'updatedAt', label: 'Updated at' },
      ],
    }
  },
  methods: {
    detailValue(field) {
      if (!this.customer) return this.$t('No value')
      if (field === 'createdAt' || field === 'updatedAt') {
        const date = this.customer[field] || this.customer.createdAt
        return date ? new Date(date).toLocaleString(this.$i18n.locale === 'ar' ? 'ar-EG' : 'en-GB') : this.$t('No value')
      }
      if (field === 'createdBy' || field === 'updatedBy' || field === 'phone') {
        return this.customer[field] || this.$t('No value')
      }
      return getCustomerValue(this.customer, field, this.$i18n.locale) || this.$t('No value')
    },
  },
}
</script>
