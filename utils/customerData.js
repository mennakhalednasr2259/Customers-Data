export const PAGE_SIZE = 15

export function createEmptyCustomerForm() {
  return { name: '', emirate: '', activity: '', phone: '', website: '', opportunity: '' }
}

export function getCustomerValue(customer, field, locale) {
  const localeSuffix = locale === 'ar' ? 'Ar' : 'En'
  const fallbackSuffix = locale === 'ar' ? 'En' : 'Ar'
  return customer[field + localeSuffix] || customer[field + fallbackSuffix] || ''
}

export function filterCustomers(customers, filters) {
  const normalize = value => String(value || '').trim().toLocaleLowerCase()
  const matchesLocalizedField = (customer, field, selectedValue) => {
    if (!selectedValue) return true
    const normalizedSelection = normalize(selectedValue)
    return normalize(customer[field + 'Ar']) === normalizedSelection ||
      normalize(customer[field + 'En']) === normalizedSelection
  }

  return customers.filter(customer => {
    const searchContent = [customer.nameAr, customer.nameEn, customer.phone].map(normalize).join(' ')
    return (!filters.search || searchContent.includes(normalize(filters.search))) &&
      matchesLocalizedField(customer, 'emirate', filters.emirate) &&
      matchesLocalizedField(customer, 'activity', filters.activity) &&
      matchesLocalizedField(customer, 'website', filters.website) &&
      matchesLocalizedField(customer, 'opportunity', filters.opportunity)
  })
}

export function getVisiblePages(currentPage, lastPage) {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, index) => index + 1)
  let firstVisiblePage = Math.max(2, currentPage - 2)
  let lastVisiblePage = Math.min(lastPage - 1, currentPage + 2)
  if (currentPage <= 4) { firstVisiblePage = 2; lastVisiblePage = 5 }
  if (currentPage >= lastPage - 3) {
    firstVisiblePage = lastPage - 4
    lastVisiblePage = lastPage - 1
  }
  const middlePages = Array.from({ length: lastVisiblePage - firstVisiblePage + 1 }, (_, index) => firstVisiblePage + index)
  return [1].concat(
    firstVisiblePage > 2 ? ['...'] : [],
    middlePages,
    lastVisiblePage < lastPage - 1 ? ['...'] : [],
    [lastPage],
  )
}

export function createSeedCustomers() {
  const seedRows = [
    ['شركة آفاق للتقنية', 'Afaq Technology', 'دبي', 'Dubai', 'تقنية المعلومات', 'Information Technology', '+971 50 234 1000', 'لديه موقع', 'Has website', 'مرتفعة', 'High'],
    ['مؤسسة النور التجارية', 'Al Noor Trading', 'أبوظبي', 'Abu Dhabi', 'تجارة عامة', 'General Trading', '+971 52 235 1073', 'لا يوجد موقع', 'No website', 'متوسطة', 'Medium'],
    ['مطاعم وردة الخليج', 'Gulf Rose Restaurants', 'الشارقة', 'Sharjah', 'مطاعم ومقاهي', 'Restaurants & Cafes', '+971 53 236 1146', 'قيد الإنشاء', 'Under construction', 'منخفضة', 'Low'],
    ['مجموعة المدار للمقاولات', 'Al Madar Contracting Group', 'عجمان', 'Ajman', 'مقاولات', 'Construction', '+971 54 237 1219', 'لديه موقع', 'Has website', 'جديدة', 'New'],
    ['مركز خطوة للتدريب', 'Khotwa Training Center', 'رأس الخيمة', 'Ras Al Khaimah', 'تعليم', 'Education', '+971 55 238 1292', 'لا يوجد موقع', 'No website', 'مرتفعة', 'High'],
    ['شركة رؤى للاستشارات', 'Roaa Consulting', 'الفجيرة', 'Fujairah', 'خدمات استشارية', 'Consulting Services', '+971 56 239 1365', 'قيد الإنشاء', 'Under construction', 'متوسطة', 'Medium'],
    ['متجر بيت العائلة', 'Family House Store', 'دبي', 'Dubai', 'تجارة عامة', 'General Trading', '+971 57 240 1438', 'لديه موقع', 'Has website', 'منخفضة', 'Low'],
    ['شركة مسار للحلول الرقمية', 'Masar Digital Solutions', 'أبوظبي', 'Abu Dhabi', 'تقنية المعلومات', 'Information Technology', '+971 58 241 1511', 'لا يوجد موقع', 'No website', 'جديدة', 'New'],
    ['عيادات الندى الطبية', 'Al Nada Clinics', 'الشارقة', 'Sharjah', 'خدمات استشارية', 'Consulting Services', '+971 59 242 1584', 'قيد الإنشاء', 'Under construction', 'مرتفعة', 'High'],
    ['مؤسسة الميناء للخدمات', 'Al Mina Services', 'عجمان', 'Ajman', 'خدمات استشارية', 'Consulting Services', '+971 50 243 1657', 'لديه موقع', 'Has website', 'متوسطة', 'Medium'],
    ['أكاديمية التميز', 'Excellence Academy', 'رأس الخيمة', 'Ras Al Khaimah', 'تعليم', 'Education', '+971 51 244 1730', 'لا يوجد موقع', 'No website', 'منخفضة', 'Low'],
    ['شركة روافد للتجارة', 'Rawafed Trading', 'الفجيرة', 'Fujairah', 'تجارة عامة', 'General Trading', '+971 52 245 1803', 'قيد الإنشاء', 'Under construction', 'جديدة', 'New'],
    ['مقهى جلسة', 'Jalsa Cafe', 'دبي', 'Dubai', 'مطاعم ومقاهي', 'Restaurants & Cafes', '+971 53 246 1876', 'لديه موقع', 'Has website', 'مرتفعة', 'High'],
    ['شركة أبعاد للتصميم', 'Abaad Design', 'أبوظبي', 'Abu Dhabi', 'تقنية المعلومات', 'Information Technology', '+971 54 247 1949', 'لا يوجد موقع', 'No website', 'متوسطة', 'Medium'],
    ['مركز توازن الصحي', 'Tawazon Wellness Center', 'الشارقة', 'Sharjah', 'خدمات استشارية', 'Consulting Services', '+971 55 248 2022', 'قيد الإنشاء', 'Under construction', 'منخفضة', 'Low'],
    ['مجموعة قمم العقارية', 'Qimam Properties', 'عجمان', 'Ajman', 'تجارة عامة', 'General Trading', '+971 56 249 2095', 'لديه موقع', 'Has website', 'جديدة', 'New'],
    ['شركة نبض للاتصالات', 'Nabd Telecom', 'رأس الخيمة', 'Ras Al Khaimah', 'تقنية المعلومات', 'Information Technology', '+971 57 250 2168', 'لا يوجد موقع', 'No website', 'مرتفعة', 'High'],
    ['مؤسسة الساحة', 'Al Saha Establishment', 'الفجيرة', 'Fujairah', 'مقاولات', 'Construction', '+971 58 251 2241', 'قيد الإنشاء', 'Under construction', 'متوسطة', 'Medium'],
    ['شركة أفق للبرمجيات', 'Ofuq Software', 'دبي', 'Dubai', 'تقنية المعلومات', 'Information Technology', '+971 59 252 2314', 'لديه موقع', 'Has website', 'منخفضة', 'Low'],
    ['مركز الإبداع التعليمي', 'Ibdaa Education Center', 'أبوظبي', 'Abu Dhabi', 'تعليم', 'Education', '+971 50 253 2387', 'لا يوجد موقع', 'No website', 'جديدة', 'New'],
    ['متاجر النخبة', 'Elite Stores', 'الشارقة', 'Sharjah', 'تجارة عامة', 'General Trading', '+971 51 254 2460', 'قيد الإنشاء', 'Under construction', 'مرتفعة', 'High'],
    ['شركة البيان للمحاماة', 'Al Bayan Legal', 'عجمان', 'Ajman', 'خدمات استشارية', 'Consulting Services', '+971 52 255 2533', 'لديه موقع', 'Has website', 'متوسطة', 'Medium'],
    ['مؤسسة دروب للسياحة', 'Doroub Travel', 'رأس الخيمة', 'Ras Al Khaimah', 'خدمات استشارية', 'Consulting Services', '+971 53 256 2606', 'لا يوجد موقع', 'No website', 'منخفضة', 'Low'],
    ['شركة سحاب للأنظمة', 'Sahab Systems', 'الفجيرة', 'Fujairah', 'تقنية المعلومات', 'Information Technology', '+971 54 257 2679', 'قيد الإنشاء', 'Under construction', 'جديدة', 'New'],
  ]

  return seedRows.map((row, index) => ({
    id: 'CUS-' + String(index + 1).padStart(4, '0'),
    nameAr: row[0], nameEn: row[1], emirateAr: row[2], emirateEn: row[3],
    activityAr: row[4], activityEn: row[5], phone: row[6],
    websiteAr: row[7], websiteEn: row[8], opportunityAr: row[9], opportunityEn: row[10],
  }))
}
