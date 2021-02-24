import { sortData, formatNumber } from './tools'
import { fetchGlobalCases } from './globalCase'
import './changeList';

const tableWrapper = document.getElementById('cases-wrapper');
const searchInput = document.getElementById('cases-search');

let countries;
let searchTerm = '';

export const fetchCountries = async () => {
  countries = await fetch('https://disease.sh/v3/covid-19/countries')
  .then(res => res.json());  
}

const showCountries = async () => {

  await fetchCountries();

  tableWrapper.innerHTML = '';

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  table.classList = 'country__list-table'
  table.append(tbody); 
  tableWrapper.append(table);

  sortData(countries)
  .filter(country => country.country.toLowerCase().includes(searchTerm.toLowerCase()))
  .forEach((country) => {
    tbody.insertAdjacentHTML('afterbegin',
    `<tr class="country-item" data-country="${country.country}">
      <th>
        <img class="country-item__flag" src=${country.countryInfo.flag}>
      </th>
      <th>
        <h3 class="country-item__name">${country.country}</h3>
      </th>
      <th>
        <h3 class="country-item__info info-cases">
          ${formatNumber(country.cases)}
        </h3>
        <h3 class="country-item__info info-death none">
          ${formatNumber(country.deaths)}
        </h3>
        <h3 class="country-item__info info-recovered none">
          ${formatNumber(country.recovered)}
        </h3>
      </th>
    <tr>`
    );
  });
};

function search() {
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    showCountries();
  });
}

showCountries();
fetchGlobalCases();
search();

function switchDataToRecovered () {
  const targetCases = document.querySelectorAll('.info-cases');
  const targetDeath = document.querySelectorAll('.info-death');
  const targetRecovered = document.querySelectorAll('.info-recovered');
  
  targetCases.forEach(item => item.classList.add('none'));
  targetDeath.forEach(item => item.classList.add('none'));
  targetRecovered.forEach(item => item.classList.remove('none'));
}

function switchDataToDeaths () {
  const targetCases = document.querySelectorAll('.info-cases');
  const targetDeath = document.querySelectorAll('.info-death');
  const targetRecovered = document.querySelectorAll('.info-recovered');

  targetCases.forEach(item => item.classList.add('none'));
  targetDeath.forEach(item => item.classList.remove('none'));
  targetRecovered.forEach(item => item.classList.add('none'));
}

function switchDataToCases () {
  const targetCases = document.querySelectorAll('.info-cases');
  const targetDeath = document.querySelectorAll('.info-death');
  const targetRecovered = document.querySelectorAll('.info-recovered');

  targetCases.forEach(item => item.classList.remove('none'));
  targetDeath.forEach(item => item.classList.add('none'));
  targetRecovered.forEach(item => item.classList.add('none'));
}

function sliderData() {
  const btnDeathSwitch = document.querySelector('.country__title').innerHTML;
  switch(btnDeathSwitch) {
    case 'Total Deaths':
      switchDataToDeaths();
    break;
    case 'Total Recovered':
      switchDataToRecovered();
    break;
    case 'Total Cases':
      switchDataToCases()
    break;
    default:
    console.error();
  }
};

document.querySelectorAll('.country__btn').forEach((btnCountry) => {
  btnCountry.addEventListener('click', () => sliderData());
});

