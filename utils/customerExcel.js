import * as XLSX from 'xlsx'

const HEADER_ALIASES = {
  name: ['customername', 'اسم العميل', 'الاسم'],
  emirate: ['emirate', 'الإمارة', 'الامارة'],
  activity: ['activity', 'النشاط'],
  phone: ['phone', 'phonenumber', 'رقم الهاتف', 'الهاتف'],
  website: ['websitestatus', 'website', 'حالة الموقع'],
  opportunity: ['salesopportunity', 'opportunity', 'فرصة البيع'],
}

function normalizeHeader(value) {
  return String(value || '').trim().toLocaleLowerCase().replace(/[\s_-]/g, '')
}

export function downloadCustomerWorkbook(headers, rows, filename) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers')
  XLSX.writeFile(workbook, filename)
}

export async function readCustomersFromFile(file, creatorName) {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })
  if (rows.length < 2) throw new Error('empty')

  const normalizedHeaders = rows[0].map(normalizeHeader)
  const columnIndexes = {}
  Object.keys(HEADER_ALIASES).forEach(field => {
    columnIndexes[field] = normalizedHeaders.findIndex(header =>
      HEADER_ALIASES[field].some(alias => normalizeHeader(alias) === header),
    )
  })
  if (columnIndexes.name < 0) throw new Error('missing name')

  const importedAt = new Date().toISOString()
  const customers = rows.slice(1)
    .filter(row => String(row[columnIndexes.name] || '').trim())
    .map((row, index) => {
      const readValue = field => columnIndexes[field] >= 0
        ? String(row[columnIndexes[field]] || '').trim()
        : ''
      const name = readValue('name')
      const emirate = readValue('emirate')
      const activity = readValue('activity')
      const website = readValue('website')
      const opportunity = readValue('opportunity')

      return {
        id: 'IMP-' + Date.now() + '-' + index,
        createdBy: creatorName,
        updatedBy: creatorName,
        createdAt: importedAt,
        updatedAt: importedAt,
        nameAr: name, nameEn: name,
        emirateAr: emirate, emirateEn: emirate,
        activityAr: activity, activityEn: activity,
        phone: readValue('phone'),
        websiteAr: website, websiteEn: website,
        opportunityAr: opportunity, opportunityEn: opportunity,
      }
    })
  if (!customers.length) throw new Error('no customers')
  return customers
}
