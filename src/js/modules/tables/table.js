import { sortData, formatNumber } from './tools'

const tableInfo = document.querySelector('.table-info');
const testContainer = document.getElementById('test-container');
const tableWrapper = document.getElementById('cases-wrapper');
const beginChartCountry = 'USA'

function getCountriesDaily (e) {
  const targetDailyCountry = e.target.closest('.country-item').dataset.country;
  getDailyCovidData(targetDailyCountry);
}

export default function markerDaily(e) {
  const country = e.target.options.dataSchedule;
  getDailyCovidData(country)
}

async function getDailyCovidData(country) {
  const fetchTargetCountry = `https://disease.sh/v3/covid-19/countries/${country}`;
  const res = await fetch(fetchTargetCountry);
  const data = await res.json();
  totalDataDeaths(data);
}

function totalDataDeaths(data) {
  tableInfo.innerHTML = '';
  testContainer.innerHTML = '';

  tableInfo.insertAdjacentHTML('afterbegin', `
  <h2 class="country__title table-info__title" id="table-country">
    ${data.country}
  <h2>
  <h3 class="container__title">
    Total Deaths: 
  </h3>
  <span class="container__info black">
    ${formatNumber(data.deaths)}
  </span>
  <h3 class="container__title">
    Total Recovered: 
  </h3>
  <span class="container__info green">
    ${formatNumber(data.recovered)}
  </span>
  `);

  testContainer.insertAdjacentHTML('afterbegin', `
  <h2 class="country__title table-info__title">
    ${data.country}
  </h2>
  <div class="per100-info">
    <h3 class="container__title">Deaths (per 100 000): </h3> 
    <span class="container__info black">
      ${formatNumber(Math.trunc(100 / data.deaths * data.population))}
    </span>
    <h3 class="container__title">Recovered (per 100 000): </h3> 
    <span class="container__info green">
      ${formatNumber(Math.trunc(100 / data.recovered * data.population))}
    </span>
  </div>
  <div class="day-info">
    <h3 class="container__title">Today Deaths: </h3> 
    <span class="container__info black">
      ${formatNumber(data.todayDeaths)}
    </span>
    <h3 class="container__title">Today Recovered: </h3> 
    <span class="container__info green">
      ${formatNumber(data.todayRecovered)}
      </span>
  </div>
  `)
}

getDailyCovidData(beginChartCountry)
tableWrapper.addEventListener('click', (e) => getCountriesDaily(e));
