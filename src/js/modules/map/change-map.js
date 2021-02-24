export default function changeMap(e) {
  document.querySelectorAll('.map').forEach((map) => {
    if (!(map.classList.contains('hide'))) {
      map.classList.add('hide');
    }
  })

  const dataId = e.target.dataset.id;
  document.querySelector(`#${dataId}`).classList.remove('hide');

  document.querySelectorAll('.btn-map').forEach((btn) => {
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
    }
  })

  e.target.classList.add('active');
}
