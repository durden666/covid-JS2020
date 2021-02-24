import changeMap from './change-map';
import changeLegend from './change-legend';
import togglePopup from './toggle-popup';

document.querySelectorAll('.btn-map').forEach((btn) => {
  btn.addEventListener('click', changeMap);
  btn.addEventListener('click', changeLegend);
});

document.querySelector('.btn-legend').addEventListener('click', togglePopup);

document.querySelector('.popup-btn-close').addEventListener('click', togglePopup);
