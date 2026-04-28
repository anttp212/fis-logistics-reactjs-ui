/** Chuyển mảng API sang format FISSelect options */
export const toSelectOptions = <T extends { id: string; name: string; [key: string]: any }>(
  items: T[] | undefined
): { items: { label: string; value: string; [key: string]: any }[] }[] => [
  { items: (items ?? []).map((item) => ({ label: item.name, value: item.id, ...item })) }
]
