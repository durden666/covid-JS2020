import { formatNumber } from './tools'

const infoGlobalCases = document.getElementById('global-cases');
const totalInfo = document.querySelector('.total-info');
let globalCases;

const fetchGlobalCases = async () => {
  globalCases = await fetch('https://disease.sh/v3/covid-19/all').then(res => res.json());

  infoGlobalCases.insertAdjacentHTML('afterbegin',
    `<h2 class="global__title">Global Cases</h2>
    <p class="global__subtitle">
      ${formatNumber(globalCases.cases)}
    </p>`);

  totalInfo.insertAdjacentHTML('afterbegin',
    `<h2 class="container__title">Global Deaths</h2>
    <p class="container__info black">${formatNumber(globalCases.deaths)}</p>
    <h2 class="container__title">Global Recovered</h2>
    <p class="container__info green">${formatNumber(globalCases.recovered)}</p>`);
}

export { fetchGlobalCases }
