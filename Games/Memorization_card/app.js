var lastValue = null,
    lastId = -1,
    mistakes = 0,
    qttCardsVisible = 0,
    qtdTurns = 0,
    tmrStart = null,
 content = [
    { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 4, value: 4 }, { id: 5, value: 5 }, { id: 6, value: 6 },
    { id: 7, value: 1 }, { id: 8, value: 2 }, { id: 9, value: 3 }, { id: 10, value: 4 }, { id: 11, value: 5 }, { id: 12, value: 6 }
 ];

init();

function init() {  

    updateCards();

    document.querySelectorAll('.card').forEach(function(el, idx, arr) {        

        el.addEventListener('click', function(event) {   
            
            if (qtdTurns === 0) return;

            if (el.firstChild.style.visibility === 'visible') return;

            if (lastValue !== el.firstChild.textContent) {
                if (lastId !== -1) {
                    document.getElementById(lastId).style.visibility = 'hidden';
                    lastValue = null;
                    mistakes++;
                    document.querySelector('.result').textContent = 'mistakes: ' + mistakes;                    
                }

                el.firstChild.style.visibility = lastValue == null ? 'visible' : 'hidden';
                lastId = el.firstChild.id;
                lastValue = el.firstChild.textContent;
            } else {
                document.getElementById(lastId).style.visibility = 'visible';
                el.firstChild.style.visibility = 'visible';
                document.getElementById(lastId).classList.add('matched');
                el.firstChild.classList.add('matched');
                
                qttCardsVisible = document.querySelectorAll('.matched').length;

                if (qttCardsVisible === content.length) {
                    document.getElementById('btn-start').style.visibility = 'visible';

                    document.querySelectorAll('.right-panel ol').forEach(function(el) {

                        if (qtdTurns > 5) {
                            qtdTurns = 0;
                            el.innerHTML = '';
                        }

                        el.insertAdjacentHTML('beforeend', '<li>' + (Math.floor((new Date() - tmrStart)/1000) -5) + ' sec. | ' + mistakes + ' mistakes</li>');
                    });

                    document.querySelector('.result').textContent = 'Finished in ' + (Math.floor((new Date() - tmrStart)/1000) -5) + ' Seconds with ' + mistakes + ' mistakes.';
                    mistakes = 0;
                }

                lastId = -1;
                lastValue = null;
            }
        });
        el.firstChild.style.visibility = 'hidden';
    });
}

document.getElementById('btn-start').addEventListener('click', function(event) {  
    tmrStart = new Date();
    qtdTurns++;

    document.querySelector('.result').textContent = '';
    updateCards();
    countDown(4, function () {        
        document.querySelectorAll('.card').forEach(function(el) {
            el.firstChild.style.visibility = 'hidden';
        });            
    });
});

function updateCards() {
    var randomContent = [];
    content.forEach(function (el, idx, arr) {
        getRandomIdxFromArray(randomContent, content);
    });

    document.querySelectorAll('.card').forEach(function (el, idx, arr) {        
        if (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.insertAdjacentHTML('beforeend', '<p id=' + content[randomContent[idx]].id + ' class="card-content" style="visibility: hidden;">' + content[randomContent[idx]].value + '</p>');
    });
}

function countDown(i, callback) {
    callback = callback || function(){};
    var int = setInterval(function() {
        if (i === 4) {
            document.getElementById('btn-start').style.visibility = 'hidden';     
            document.querySelectorAll('.card').forEach(function(el) {        
                el.firstChild.style.visibility = 'visible';
            });            
        }

        if (i !== 0) {
            document.querySelector('.result').textContent = 'Starting in ' + i + ' seconds';
        } else {
            document.querySelector('.result').textContent = '';
        }

        i-- || (clearInterval(int), callback());
    }, 1000);
}

function getRandomIdxFromArray(array, arrayFrom) {
    var randomIdx = Math.floor(Math.random() * arrayFrom.length);

    while (array.indexOf(randomIdx) > -1) {
        randomIdx = Math.floor(Math.random() * arrayFrom.length);
    }    

    array.push(randomIdx);
    return randomIdx;    
}