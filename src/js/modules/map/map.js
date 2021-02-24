import leafetProviders from './leaflet-providers';
import markerOnClick from '../tables/chart';
import markerDaily from '../tables/table'

function createMap(mapId, section) {

  const mapOptions = {
    center: [17.385044, 78.486671],
    zoom: 3,
    attributionControl: false
  }

  const map = new L.map(`${mapId}`, mapOptions);
  const cardoDBPositron = L.tileLayer.provider('CartoDB.Positron');
  const cardoDBVoyager = L.tileLayer.provider('CartoDB.Voyager');
  cardoDBPositron.addTo(map);
  cardoDBVoyager.addTo(map);

  const baseMaps = {
    CartoDBPositron: cardoDBPositron,
    CardoDBVoyager: cardoDBVoyager
  };

  async function getMarkers(value) {
    const url = `https://disease.sh/v3/covid-19/countries`;
    const res = await fetch(url);
    const data = await res.json();
    const markerArr = [];

    for (let key in data) {
      const country = data[key].country;
      const lat = data[key].countryInfo.lat;
      const long = data[key].countryInfo.long;
      const sectionIndex = data[key][value];

      let myIcon;
      if (sectionIndex > 1000000) {
        myIcon = L.divIcon({ className: `div-icon ${value}-5` });
      } else if (sectionIndex > 500000) {
        myIcon = L.divIcon({ className: `div-icon ${value}-4` });
      } else if (sectionIndex > 250000) {
        myIcon = L.divIcon({ className: `div-icon ${value}-3` });
      } else if (sectionIndex > 100000) {
        myIcon = L.divIcon({ className: `div-icon ${value}-2` });
      } else {
        myIcon = L.divIcon({ className: `div-icon ${value}-1` });
      }
      const dataScheduleInfo = country;
      const marker = L.marker([lat, long], { dataSchedule: dataScheduleInfo, icon: myIcon })
        .bindPopup(`<h2 class="map-subtitle">${country}</h2><p>${value.toUpperCase()}: ${sectionIndex.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</p>`);
      marker.addEventListener('click', markerOnClick);
      marker.addEventListener('click', markerDaily);
      marker.addEventListener('mouseover', (e) => {
        marker.openPopup();
        document.querySelector('.leaflet-popup').style.bottom = '15px';
      });
      markerArr.push(marker);
    }

    let layer = new L.layerGroup(markerArr).addTo(map);
    L.control.layers(baseMaps, {
      'markers': layer
    }).addTo(map);
  }

  getMarkers(section);
}

const mapArr = document.querySelectorAll('.map');
const mapSectionArr = document.querySelectorAll('[data-map]');

for (let i = 0; i < mapArr.length; i++) {
  createMap(mapArr[i].id, mapSectionArr[i].dataset.map);
}
