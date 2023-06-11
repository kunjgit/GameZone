'use strict';

function Journal() {
    var i, count,
        descriptions = [
            'Weak spirit easily defeated by light.',
            'Stronger spirit that is more susceptible to lightning than light.',
            'Possessed animal that is fast and may reveal a spirit after being defeated.',
            'Possessed human that may reveal a stronger spirit after being defeated.',
            'Demonic spirit inhabiting a strong non-human physical body.'
        ],
        spirits = document.getElementById('spirits'),
        level = document.getElementById('level'),
        save = localStorage['utc3'] ? JSON.parse(localStorage['utc3']) : 0;

    if (save) {
        count = save.level;
        count = (count + 1) + ['st','nd','rd','th'][count % 20 < 3 ? count % 20 : 3];
        level.innerHTML = 'I am not the first to attempt this. Someone already made it to the ' + count + ' floor.';
    }

    count = save ? save.spirits : 0;
    for (i = 0; i < count; i += 1) {
        spirits.innerHTML += '<li><span class="img" style="background-position: -32px -' + (48 + 16 * i) +
            'px;"></span>' + descriptions[i] + '</li>';
    }
}

window['Journal'] = Journal;