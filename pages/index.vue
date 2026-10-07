<template>
  <v-container fluid class="customers-page">
    <header class="app-page-header">
      <div class="app-page-header__copy">
        <h1 class="app-page-header__title">{{ $t('Customer Data') }}</h1>
      </div>
      <div class="app-page-header__actions header-actions">
        <button class="button button-primary" type="button" @click="openAdd">
          <v-icon small left>mdi-plus</v-icon>{{ $t('Add customer') }}
        </button>
        <v-menu offset-y left content-class="customers-actions-menu">
          <template v-slot:activator="{ on, attrs }">
            <button class="button button-outline header-actions-menu" type="button" v-bind="attrs" v-on="on">
              <v-icon small left>mdi-dots-horizontal</v-icon>{{ $t('More actions') }}
            </button>
          </template>
          <v-list dense>
            <v-list-item @click="downloadTemplate">
              <v-list-item-icon><v-icon small>mdi-file-download-outline</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $t('Download template') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$refs.fileInput.click()">
              <v-list-item-icon><v-icon small>mdi-file-upload-outline</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $t('Import Excel') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportExcel">
              <v-list-item-icon><v-icon small>mdi-microsoft-excel</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $t('Export Excel') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <button class="button button-outline header-preference-button" type="button" :aria-label="$t('Language switch')" :title="$t('Language switch')" @click="toggleLanguage">
          <v-icon small>mdi-translate</v-icon>
        </button>
        <button class="button button-outline header-preference-button" type="button" :aria-label="darkMode ? $t('Light mode') : $t('Dark mode')" :title="darkMode ? $t('Light mode') : $t('Dark mode')" @click="toggleTheme">
          <v-icon small>{{ darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
        </button>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" hidden @change="importExcel">
      </div>
    </header>

    <customer-filters
      v-model="filters"
      :filter-fields="filterFields"
      :filter-options="filterOptions"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <customer-table
      :customers="pagedCustomers"
      :row-offset="rowOffset"
      :has-active-filters="hasActiveFilters"
      @view="openView"
      @edit="openEdit"
      @delete="askDelete"
      @reset-filters="resetFilters"
    />

    <customer-pagination
      :current-page="currentPage"
      :last-page="lastPage"
      :visible-pages="visiblePages"
      @page-change="goToPage"
    />

    <customer-form-dialog
      v-model="formDialog"
      :form="form"
      :editing-id="editingId"
      @save="submitForm"
    />
    <customer-details-dialog
      v-model="viewDialog"
      :customer="selectedCustomer"
      @edit="openEdit"
    />
    <customer-delete-dialog
      v-model="deleteDialog"
      @confirm="confirmDelete"
    />

    <v-snackbar v-model="snackbar" :timeout="2600" color="secondary" :right="$i18n.locale === 'en'">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { PAGE_SIZE, createEmptyCustomerForm, filterCustomers, getCustomerValue, getVisiblePages } from '~/utils/customerData'
import { loadCustomers as loadStoredCustomers, saveCustomers } from '~/utils/customerStorage'
import { downloadCustomerWorkbook, readCustomersFromFile } from '~/utils/customerExcel'

export default {
  name: 'CustomersPage',
  data() {
    return {
      customers: [],
      ready: false,
      darkMode: false,
      currentPage: 1,
      filters: { search: '', emirate: '', activity: '', website: '', opportunity: '' },
      appliedFilters: { search: '', emirate: '', activity: '', website: '', opportunity: '' },
      filterFields: [
        { key: 'emirate', label: 'Emirate' },
        { key: 'activity', label: 'Activity' },
        { key: 'website', label: 'Website status' },
        { key: 'opportunity', label: 'Sales opportunity' },
      ],
      formDialog: false,
      viewDialog: false,
      deleteDialog: false,
      editingId: null,
      selectedCustomer: null,
      pendingDelete: null,
      form: createEmptyCustomerForm(),
      snackbar: false,
      snackbarMessage: '',
    }
  },
  computed: {
    filteredCustomers() {
      return filterCustomers(this.customers, this.appliedFilters)
    },
    hasActiveFilters() {
      return Object.values(this.appliedFilters).some(value => Boolean(String(value || '').trim()))
    },
    filterOptions() {
      return this.filterFields.reduce((optionsByField, field) => {
        const options = new Map()
        this.customers.forEach(customer => {
          const value = customer[field.key + 'Ar'] || customer[field.key + 'En']
          if (value && !options.has(value)) {
            options.set(value, {
              value,
              text: this.customerValue(customer, field.key),
            })
          }
        })
        optionsByField[field.key] = Array.from(options.values())
        return optionsByField
      }, {})
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.filteredCustomers.length / PAGE_SIZE))
    },
    rowOffset() {
      return (this.currentPage - 1) * PAGE_SIZE
    },
    pagedCustomers() {
      return this.filteredCustomers.slice(this.rowOffset, this.rowOffset + PAGE_SIZE)
    },
    visiblePages() {
      return getVisiblePages(this.currentPage, this.lastPage)
    },
  },
  mounted() {
    this.loadCustomers()
    this.$nextTick(() => {
      this.applyTheme(this.readPreference('customers-data-theme') === 'dark')
      const savedLocale = this.readPreference('customers-data-locale')
      if (savedLocale && savedLocale !== this.$i18n.locale) this.$i18n.setLocale(savedLocale)
      this.$vuetify.rtl = this.$i18n.locale === 'ar'
    })
  },
  methods: {
    loadCustomers() {
      const defaultCreator = this.$i18n.locale === 'ar' ? 'مريم أحمد' : 'Maryam Ahmed'
      this.customers = loadStoredCustomers(defaultCreator)
      this.ready = true
      this.persistCustomers()
    },
    persistCustomers() {
      if (this.ready && !saveCustomers(this.customers)) this.notify(this.$t('Storage unavailable'))
    },
    customerValue(customer, field) {
      return getCustomerValue(customer, field, this.$i18n.locale)
    },
    applyFilters() {
      this.appliedFilters = { ...this.filters }
      this.currentPage = 1
    },
    resetFilters() {
      this.filters = { search: '', emirate: '', activity: '', website: '', opportunity: '' }
      this.appliedFilters = { ...this.filters }
      this.currentPage = 1
    },
    goToPage(page) {
      const nextPage = Number(page)
      if (Number.isInteger(nextPage) && nextPage >= 1 && nextPage <= this.lastPage) this.currentPage = nextPage
    },
    applyTheme(isDark) {
      this.darkMode = Boolean(isDark)
      this.$vuetify.theme.dark = this.darkMode
      document.documentElement.dataset.theme = this.darkMode ? 'dark' : 'light'
    },
    readPreference(key) {
      try { return window.localStorage.getItem(key) } catch (_) { return null }
    },
    savePreference(key, value) {
      try { window.localStorage.setItem(key, value) } catch (_) { return false }
      return true
    },
    toggleTheme() {
      this.applyTheme(!this.darkMode)
      this.savePreference('customers-data-theme', this.darkMode ? 'dark' : 'light')
    },
    toggleLanguage() {
      const nextLocale = this.$i18n.locale === 'ar' ? 'en' : 'ar'
      this.$i18n.setLocale(nextLocale)
      this.$vuetify.rtl = nextLocale === 'ar'
      this.savePreference('customers-data-locale', nextLocale)
    },
    openAdd() {
      this.editingId = null
      this.selectedCustomer = null
      this.form = createEmptyCustomerForm()
      this.formDialog = true
    },
    openEdit(customer) {
      this.editingId = customer.id
      this.selectedCustomer = customer
      this.viewDialog = false
      this.form = {
        name: this.customerValue(customer, 'name'),
        emirate: this.customerValue(customer, 'emirate'),
        activity: this.customerValue(customer, 'activity'),
        phone: customer.phone || '',
        website: this.customerValue(customer, 'website'),
        opportunity: this.customerValue(customer, 'opportunity'),
      }
      this.formDialog = true
    },
    openView(customer) {
      this.selectedCustomer = customer
      this.viewDialog = true
    },
    submitForm(formValues) {
      const locale = this.$i18n.locale
      const existing = this.editingId ? this.customers.find(customer => customer.id === this.editingId) : null
      const record = existing ? { ...existing } : { id: 'CUS-' + Date.now().toString().slice(-8) }
      ;['name', 'emirate', 'activity', 'website', 'opportunity'].forEach(field => {
        const currentLocaleField = field + (locale === 'ar' ? 'Ar' : 'En')
        const otherLocaleField = field + (locale === 'ar' ? 'En' : 'Ar')
        record[currentLocaleField] = formValues[field].trim()
        record[otherLocaleField] = record[otherLocaleField] || formValues[field].trim()
      })
      record.phone = formValues.phone.trim()
      const now = new Date().toISOString()
      if (existing) {
        record.updatedBy = locale === 'ar' ? 'مريم أحمد' : 'Maryam Ahmed'
        record.updatedAt = now
        this.customers = this.customers.map(customer => customer.id === existing.id ? record : customer)
      } else {
        record.createdBy = locale === 'ar' ? 'مريم أحمد' : 'Maryam Ahmed'
        record.updatedBy = record.createdBy
        record.createdAt = now
        record.updatedAt = now
        this.customers.unshift(record)
      }
      this.persistCustomers()
      this.formDialog = false
      this.currentPage = 1
      this.applyFilters()
      this.notify(this.$t('Customer saved'))
      this.selectedCustomer = null
    },
    askDelete(customer) {
      this.pendingDelete = customer
      this.deleteDialog = true
    },
    confirmDelete() {
      if (!this.pendingDelete) return
      this.customers = this.customers.filter(customer => customer.id !== this.pendingDelete.id)
      this.persistCustomers()
      this.pendingDelete = null
      this.deleteDialog = false
      if (this.currentPage > this.lastPage) this.currentPage = this.lastPage
      this.notify(this.$t('Customer deleted'))
    },
    notify(message) {
      this.snackbarMessage = message
      this.snackbar = true
    },
    workbookHeaders() {
      return [
        this.$t('Customer name'), this.$t('Emirate'), this.$t('Activity'),
        this.$t('Phone'), this.$t('Website status'), this.$t('Sales opportunity'),
      ]
    },
    workbookRows(customers) {
      return customers.map(customer => [
        this.customerValue(customer, 'name'),
        this.customerValue(customer, 'emirate'),
        this.customerValue(customer, 'activity'),
        customer.phone || '',
        this.customerValue(customer, 'website'),
        this.customerValue(customer, 'opportunity'),
      ])
    },
    downloadTemplate() {
      downloadCustomerWorkbook(this.workbookHeaders(), [], 'customers-template.xlsx')
      this.notify(this.$t('Template downloaded'))
    },
    exportExcel() {
      downloadCustomerWorkbook(this.workbookHeaders(), this.workbookRows(this.filteredCustomers), 'customers.xlsx')
      this.notify(this.$t('Export completed'))
    },
    async importExcel(event) {
      const file = event.target.files && event.target.files[0]
      event.target.value = ''
      if (!file) return
      const creatorName = this.$i18n.locale === 'ar' ? 'مريم أحمد' : 'Maryam Ahmed'
      try {
        const importedCustomers = await readCustomersFromFile(file, creatorName)
        this.customers = importedCustomers.concat(this.customers)
        this.persistCustomers()
        this.applyFilters()
        this.notify(this.$t('Import completed'))
      } catch (_) {
        this.notify(this.$t('Import failed'))
      }
    },
  },
}
</script>
