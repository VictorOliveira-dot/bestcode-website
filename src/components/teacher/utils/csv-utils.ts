
/**
 * Converte um array de objetos para o formato CSV
 * @param data Array de objetos para converter
 * @param headers Cabeçalhos personalizados opcionais
 * @returns String formatada em CSV
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  headers?: { [key in keyof T]?: string }
): string => {
  if (data.length === 0) return '';

  // Obtém todas as chaves do primeiro objeto
  const keys = Object.keys(data[0]) as Array<keyof T>;
  
  // Cria linha de cabeçalho usando cabeçalhos fornecidos ou chaves
  const headerRow = keys.map(key => headers?.[key] || String(key)).join(',');
  
  // Cria linhas de dados
  const rows = data.map(item => 
    keys.map(key => {
      // Envolve strings que contêm vírgulas em aspas
      const value = item[key];
      const stringValue = typeof value === 'string' ? value : String(value);
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',')
  );
  
  // Combina cabeçalho e linhas de dados
  return [headerRow, ...rows].join('\n');
};

/**
 * Baixa dados como um arquivo CSV
 * @param data O conteúdo CSV
 * @param filename O nome do arquivo
 */
export const downloadCSV = (data: string, filename: string): void => {
  // Cria um blob
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  
  // Cria um link para download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Anexa ao corpo, clica e remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
