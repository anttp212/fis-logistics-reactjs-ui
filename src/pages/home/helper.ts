export const generateUniqueId = (existingIds: number[]): number => {
  let id
  do {
    id = Math.floor(Math.random() * 1000000) // Tạo ID ngẫu nhiên từ 0 đến 999999
  } while (existingIds.includes(id))
  return id
}
