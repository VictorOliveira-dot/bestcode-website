
/**
 * Validates a Brazilian CPF number
 * @param cpf - The CPF string to validate
 * @returns Boolean indicating if the CPF is valid
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // CPF must have 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check for known invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Calculate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  // Calculate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  // Check if calculated verification digits match the CPF
  return (
    parseInt(cleanCPF.charAt(9)) === digit1 &&
    parseInt(cleanCPF.charAt(10)) === digit2
  );
};

/**
 * Validates a Brazilian date format (DD/MM/YYYY)
 * @param date - The date string to validate
 * @returns Boolean indicating if the date is valid and not in the future
 */
export const validateDateOfBirth = (date: string): boolean => {
  // Check format
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
  
  const [day, month, year] = date.split('/').map(Number);
  
  // Check if date is valid
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return false;
  }
  
  // Check if date is not in the future and not more than 120 years ago
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120);
  
  return dateObj <= today && dateObj >= minDate;
};

/**
 * Validates a Brazilian phone number
 * @param phone - The phone string to validate
 * @returns Boolean indicating if the phone is valid
 */
export const validateBrazilianPhone = (phone: string): boolean => {
  // Brazilian phone number format: (xx) xxxxx-xxxx
  return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone);
};
