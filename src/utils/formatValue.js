export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const COVERED = {
  1: 1,
  2: 0.95,
  3: 0.8,
  4: 1
}

export const coveredPrice = (price, coveredLevel) => {

    if (!price) return 0;
    if (!coveredLevel) return price;

    const covered = COVERED[coveredLevel] || 0;

    if (covered) {
        return price * covered;
    }
    return price || 0;
}