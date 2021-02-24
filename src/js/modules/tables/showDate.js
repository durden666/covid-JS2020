function showDate() {
  const timeContainer = document.querySelector('#date');

  async function getDate() {
    const url = `https://disease.sh/v3/covid-19/countries`;
    const res = await fetch(url);
    const dataJSON = await res.json();
    const data = dataJSON['0'].updated;

    const date = new Date(data);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const min = date.getMinutes();

    function addZero(v) {
      return v > 9 ? v : `0${v}`;
    }

    timeContainer.innerHTML = `${month}/${day}/${year} ${hours}:${addZero(min)}`;
  }

  getDate();
}

showDate();
