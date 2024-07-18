const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.getElementById('weightdisplay')
const error = document.querySelector('.error');

var character = 'cycling';

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    // get character
    character = e.target.dataset.character;

    // remove and add active class
    btns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    formAct.textContent = character;

    var weight_gain = update(data)
    input.innerText = String(weight_gain) +  ' pounds!'
    update2(data2)

  });
});
