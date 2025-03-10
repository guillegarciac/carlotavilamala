export const visuals = Array.from({ length: 18 }, (_, i) => ({
  id: `visual${i + 1}`,
  imageUrl: `/visuals/image${String(i + 1).padStart(5, '0')}.jpg`,
  detailImages: [] // Visuals don't have detail images
})) 