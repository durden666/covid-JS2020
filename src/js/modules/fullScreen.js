const fullScreenBtns = document.querySelectorAll('.container__icon');

fullScreenBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const parentContainer = btn.parentNode;
    parentContainer.classList.toggle('full-screen');
  })
})
