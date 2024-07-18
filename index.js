const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.getElementById('weightdisplay')
const error = document.querySelector('.error');

var character = 'Wendy';

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    // get character
    character = e.target.dataset.character;

    // remove and add active class
    btns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    formAct.textContent = character;
    var data3 = []

    d3.csv("weight_happiness_data.csv").then(function(data) {
        // Log the parsed data to the console
        data3 = data;
    
        // Example: Process the data
        data.forEach(d => {
            console.log(`Name: ${d.character}, weight: ${d.weight}, happinesslevel: ${d.happinesslevel}`);
        });
    
    }).catch(function(error) {
        // Handle any errors
        console.error('Error loading or parsing data:', error);
    });

    console.log('data3',data3)

    var weight_gain = update(data)
    input.innerText = String(weight_gain) +  ' pounds!'
    update2(data)

  });
});


