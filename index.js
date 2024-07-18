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

    // set id of input field
    if (character == 'Wendy') {
        input.innerText = '2 pounds!'
    } else if (character == 'Yudu') {
        input.innerText = '200 pounds!'
    } else {
        input.innerText = '0 pounds!'
    }

    // set text of form span (the character)
    formAct.textContent = character;

    update(data)
  });
});
