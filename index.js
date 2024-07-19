const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.getElementById('weightdisplay')
const input2 = document.getElementById('happinessdisplay')
const error = document.querySelector('.error');

var character = 'Wendy';

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    // get character
    character = e.target.dataset.character;

    // remove and add active class
    btns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // formAct.textContent = character;
    var data3 = []

    d3.csv("https://wenfan1993.github.io/CS416/weight_happiness_data.csv").then(function(data) {
        // Log the parsed data to the console
    
        // Example: Process the data
        data.forEach(d => {
            console.log(`Name: ${d.character}, weight: ${d.weight}, img: ${d.img} date:${new Date(d.date)}`);
        });

        data.forEach(d => data3.push({
            character:d.character, 
            weight: d.weight,
            happinesslevel:d.happinesslevel,
            date:new Date(d.date),
            img:d.img
        }));
        // data3 = data

        console.log('data3',data3)
        var weight_gain = update(data3)
        var isHappy = update2(data3)
        input.innerText = 'How much weight ' + character + ' has gained? ' + String(weight_gain) +  ' pounds!'
        if (isHappy){
            input2.innerText = 'Is ' + character + ' more happy? Yes!'
        } else {
            input2.innerText = 'Is ' + character + ' more happy? No...'
        }

    }).catch(function(error) {
        // Handle any errors
        console.error('Error loading or parsing data:', error);
    });

  });
});



