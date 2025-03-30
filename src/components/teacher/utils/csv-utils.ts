
/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Optional custom headers
 * @returns CSV formatted string
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  headers?: { [key in keyof T]?: string }
): string => {
  if (data.length === 0) return '';

  // Get all keys from the first object
  const keys = Object.keys(data[0]) as Array<keyof T>;
  
  // Create header row using provided headers or keys
  const headerRow = keys.map(key => headers?.[key] || String(key)).join(',');
  
  // Create data rows
  const rows = data.map(item => 
    keys.map(key => {
      // Wrap strings containing commas in quotes
      const value = item[key];
      const stringValue = typeof value === 'string' ? value : String(value);
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',')
  );
  
  // Combine header and data rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Downloads data as a CSV file
 * @param data The CSV content
 * @param filename The name of the file
 */
export const downloadCSV = (data: string, filename: string): void => {
  // Create a blob
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
