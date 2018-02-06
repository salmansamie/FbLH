function initApp() {
  getLocation();
  let button = document.getElementsByClassName('c_btn')[0];
  button.classList.add('removeBtn');
  let icon = document.querySelector('#banner > button > span > i');
  icon.style.padding = '0.5rem';
  icon.classList.remove('fa-location-arrow');
  icon.classList.add('fa-spinner');
  icon.classList.add('fa-spin');
}