import { createSeedCustomers } from './customerData'

export const CUSTOMER_STORAGE_KEY = 'customers-data-training-v1'

export function loadCustomers(defaultCreator) {
  let customers
  try {
    const savedCustomers = window.localStorage.getItem(CUSTOMER_STORAGE_KEY)
    const parsedCustomers = savedCustomers && JSON.parse(savedCustomers)
    customers = Array.isArray(parsedCustomers) ? parsedCustomers : createSeedCustomers()
  } catch (_) {
    customers = createSeedCustomers()
  }

  const now = new Date().toISOString()
  return customers.map(customer => ({
    ...customer,
    createdBy: customer.createdBy || defaultCreator,
    updatedBy: customer.updatedBy || defaultCreator,
    createdAt: customer.createdAt || now,
    updatedAt: customer.updatedAt || customer.createdAt || now,
  }))
}

export function saveCustomers(customers) {
  try {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
    return true
  } catch (_) {
    return false
  }
}
