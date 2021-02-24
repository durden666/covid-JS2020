export default function showPopup(e) {
  const popup = document.querySelector('#map-popup');
  const popupBtn = document.querySelector('.btn-legend');

  popupBtn.classList.toggle('active');

  if (popupBtn.classList.contains('active')) {
    popup.classList.remove('hide');
  } else {
    popup.classList.add('hide');
  }
}
