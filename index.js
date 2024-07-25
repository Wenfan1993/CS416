const btns = [document.getElementById('character1'),document.getElementById('character2'),document.getElementById('character3')]
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input2 = document.getElementById('happinessdisplay')
const input3 = document.getElementById('conclusion')
const error = document.querySelector('.error');

const btnF = document.getElementById('filterButton')

var character = 'Wendy';

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    // get character
    character = e.target.dataset.character;
    document.getElementById("startDate").value = null;
    document.getElementById("endDate").value = null;
    

    // remove and add active class
    btns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // formAct.textContent = character;
    var data3 = []

    d3.csv("https://wenfan1993.github.io/CS416/src/weight_happiness_data.csv").then(function(data) {
        // Log the parsed data to the console
    
        // Example: Process the data
        data.forEach(d => {
            console.log(`index: ${d.index}, weight: ${d.weight}, img: ${d.img} date:${new Date(d.date)}`);
        });

        data.forEach(d => data3.push({
            character:d.character, 
            weight: d.weight,
            happinesslevel:d.happinesslevel,
            date:new Date(d.date),
            img:d.img,
            index:d.index
        }));
        // data3 = data

        console.log('data3',data3)
        var weight_gain = update(data3)
        var isHappy = update2(data3)
        if (isHappy && weight_gain>0){
            input2.innerText = 'Looks like for ' + character + ', happiness gained him/her weight'
        } else if (isHappy && weight_gain<0){
            input2.innerText = 'Looks like for ' + character + ', happiness did not gain him/her weight'
        }
    }).catch(function(error) {
        // Handle any errors
        console.error('Error loading or parsing data:', error);
    });

  });
});

btnF.addEventListener('click', e => {  
    const startDate = document.getElementById("startDate").value?new Date(document.getElementById("startDate").value):null;
    const endDate = document.getElementById("endDate").value?new Date(document.getElementById("endDate").value):null;
    var data3 = []
    d3.csv("https://wenfan1993.github.io/CS416/src/weight_happiness_data.csv").then(function(data) {
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
            img:d.img,
            index:d.index
        }));
        // data3 = data

        console.log('data3 here',data3)
        console.log('startDate here',startDate)
        console.log('endDate here',endDate)        
        const startDateUse = startDate?startDate:data3[0].date
        const endDateUse = endDate?endDate:data3[data3.length-1].date
        console.log('startDateUse here',startDateUse)
        console.log('startDateUse here',endDateUse)        
        const filteredData = data3.filter(d => d.date >= startDateUse && d.date <= endDateUse);
        console.log('filteredData here',filteredData)
        var weight_gain_new = update(filteredData)
        var isHappy_new = update2(filteredData)
        console.log()
        if (isHappy_new && weight_gain_new>0){
            input2.innerText = 'Looks like for ' + character + ', happiness gained him/her weight'
        } else {
            input2.innerText = 'Looks like for ' + character + ', happiness did not gain him/her weight'
        }
    }).catch(function(error) {
        // Handle any errors
        console.error('Error loading or parsing data:', error);
    });

    });



