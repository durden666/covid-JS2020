export default function changeLegend(e) {
  const newLegendClass = e.target.dataset.map;
  const popupDivArr = document.querySelectorAll('.popup-icon');
  const title = document.querySelector('.popup-title');

  for (let i = 0; i < popupDivArr.length; i += 1) {
    popupDivArr[i].className = 'div-icon popup-icon';
    popupDivArr[i].classList.add(`${newLegendClass}-${i + 1}`);
  }

  title.innerHTML = `Legend - Total ${newLegendClass}`;
}
