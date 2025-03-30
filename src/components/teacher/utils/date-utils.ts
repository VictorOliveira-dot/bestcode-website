
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
