function formatNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const sortData = (countries) => {
  let sortedData = [...countries];
  sortedData.sort((a, b) => {
    if (a.cases < b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export { sortData, formatNumber }