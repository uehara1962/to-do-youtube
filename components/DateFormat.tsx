interface DateFormatProps {
  date: Date | string;
  format?: "iso" | "locale" | "short";
}

/**
 * Componente para formatar datas de forma consistente entre servidor e cliente.
 * Usa toISOString() que retorna o mesmo valor em ambos os ambientes.
 */
export function DateFormat({ date, format = "iso" }: DateFormatProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // toISOString() sempre retorna o mesmo valor no servidor e cliente
  // então não há problema de hidratação
  const formattedDate = dateObj.toISOString();

  // Se precisar de formatação local, fazer no cliente apenas
  if (format === "locale" || format === "short") {
    // Para formatação local, usar um componente client-side separado
    // Por enquanto, retornar ISO para evitar problemas de hidratação
    return <span>{formattedDate}</span>;
  }

  return <span>{formattedDate}</span>;
}
