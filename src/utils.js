export function formatTIN(value) {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)];
  return parts.filter(Boolean).join('-');
}

export function isValidTIN(value) {
  return /^\d{3}-\d{3}-\d{3}$/.test(value);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPHMobile(value) {
  const digits = value.replace(/\D/g, '');
  return /^(09\d{9}|639\d{9})$/.test(digits);
}

export function toDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
}

export function toMMDDYYYY(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${m}-${d}-${y}`;
}

export function validateField(name, value, form) {
  switch (name) {
    case 'firstName':
    case 'lastName':
      return value.trim() ? '' : 'Required';
    case 'tin':
      return isValidTIN(value) ? '' : 'Format: 123-456-789';
    case 'depedStatus':
      return value ? '' : 'Required';
    case 'designation':
      return value ? '' : 'Required';
    case 'teachingStatus':
      return value ? '' : 'Required';
    case 'salaryGrade':
      return value.trim() ? '' : 'Required';
    case 'contactNumber':
      return isValidPHMobile(value) ? '' : 'Enter a valid PH mobile number';
    case 'altContactNumber':
      return value.trim() === '' || isValidPHMobile(value) ? '' : 'Enter a valid PH mobile number';
    case 'email':
      return isValidEmail(value) ? '' : 'Enter a valid email';
    case 'gender':
      return value ? '' : 'Required';
    case 'birthdate':
      return value ? '' : 'Required';
    case 'address':
      return value.trim() ? '' : 'Required';
    case 'votingBarangay':
      return value.trim() ? '' : 'Required';
    case 'precinctNumber':
      return value.trim() ? '' : 'Required';
    default:
      return '';
  }
}

export const REQUIRED_FIELDS = [
  'firstName', 'lastName', 'tin', 'depedStatus', 'designation',
  'teachingStatus', 'salaryGrade', 'contactNumber', 'email', 'gender',
  'birthdate', 'address', 'votingBarangay', 'precinctNumber',
];