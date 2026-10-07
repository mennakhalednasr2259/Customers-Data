<template>
  <v-dialog :value="value" max-width="720" persistent @input="$emit('input', $event)">
    <v-card class="modal customer-form-card">
      <header class="modal-header">
        <h2>{{ editingId ? $t('Edit customer title') : $t('Add customer title') }}</h2>
        <button class="icon-button" type="button" :aria-label="$t('Close')" @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </button>
      </header>
      <v-form ref="customerForm" @submit.prevent="submitForm">
        <div class="form-grid">
          <labeled-field class="field field-wide" :label="$t('Customer name') + ' *'" for-id="customer-name">
            <v-text-field id="customer-name" v-model.trim="formDraft.name" outlined dense hide-details="auto" maxlength="120" :rules="[requiredRule]" />
          </labeled-field>
          <labeled-field class="field" :label="$t('Emirate')" for-id="customer-emirate"><v-text-field id="customer-emirate" v-model.trim="formDraft.emirate" outlined dense hide-details maxlength="80" /></labeled-field>
          <labeled-field class="field" :label="$t('Activity')" for-id="customer-activity"><v-text-field id="customer-activity" v-model.trim="formDraft.activity" outlined dense hide-details maxlength="120" /></labeled-field>
          <labeled-field class="field" :label="$t('Phone')" for-id="customer-phone"><v-text-field id="customer-phone" v-model.trim="formDraft.phone" outlined dense hide-details dir="ltr" inputmode="tel" maxlength="30" /></labeled-field>
          <labeled-field class="field" :label="$t('Website status')" for-id="customer-website"><v-text-field id="customer-website" v-model.trim="formDraft.website" outlined dense hide-details maxlength="80" /></labeled-field>
          <labeled-field class="field field-wide" :label="$t('Sales opportunity')" for-id="customer-opportunity"><v-text-field id="customer-opportunity" v-model.trim="formDraft.opportunity" outlined dense hide-details maxlength="120" /></labeled-field>
        </div>
        <footer class="modal-actions">
          <button class="button button-outline" type="button" @click="$emit('input', false)">{{ $t('Cancel') }}</button>
          <button class="button button-primary" type="submit">{{ $t('Save') }}</button>
        </footer>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { createEmptyCustomerForm } from '~/utils/customerData'

export default {
  name: 'CustomerFormDialog',
  props: {
    value: { type: Boolean, default: false },
    form: { type: Object, required: true },
    editingId: { type: [String, Number], default: null },
  },
  data() {
    return {
      formDraft: { ...createEmptyCustomerForm() },
      requiredRule: input => !!String(input || '').trim() || this.$t('Required'),
    }
  },
  watch: {
    value(isOpen) {
      if (isOpen) this.resetDraft()
    },
    form: {
      deep: true,
      handler() { this.resetDraft() },
    },
  },
  methods: {
    resetDraft() {
      this.formDraft = { ...this.form }
      this.$nextTick(() => this.$refs.customerForm && this.$refs.customerForm.resetValidation())
    },
    submitForm() {
      if (this.$refs.customerForm.validate()) this.$emit('save', { ...this.formDraft })
    },
  },
}
</script>
