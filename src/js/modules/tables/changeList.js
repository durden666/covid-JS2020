const title = document.querySelector('.country__title');
const sectionTitle = ['Total Cases', 'Total Deaths', 'Total Recovered'];

function changeList(e) {
  let index;

  sectionTitle.forEach((item) => {
    if (item === title.innerHTML) {
      index = sectionTitle.indexOf(item);
    }
  })

  if (e.target.classList.contains('prev')) {
    if (index === 0) {
      index = 2;
    } else {
      index -= 1;
    }
  } else { 
    if (index === 2) {
      index = 0;
    } else {
      index += 1;
    }
  }

  title.innerHTML = sectionTitle[index];
}

document.querySelectorAll('.country__btn').forEach((btn) => {
  btn.addEventListener('click', changeList);
});
