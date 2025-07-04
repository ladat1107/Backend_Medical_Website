export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const COVERED = {
  1: 1,
  2: 1,
  3: 0.95,
  4: 0.8,
  5: 1
}

export const coveredPrice = (price, coveredLevel) => {
  const numericPrice = Number(price);
  if (!numericPrice || isNaN(numericPrice)) return 0;
  if (!coveredLevel) return 0;

  const covered = COVERED[coveredLevel];

  if (covered !== undefined && covered !== null) {
    return numericPrice * covered;
  }

  return 0;
}