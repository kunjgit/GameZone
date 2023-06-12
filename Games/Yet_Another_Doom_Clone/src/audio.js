// audio.js -- sounds (both audio and music) for the game

// Copyright (C) 2019, Nicholas Carlini <nicholas@carlini.com>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var sounds = {}

var context = new AudioContext();
var play = (which, location) => {
    var m = context.createBuffer(1,which.length,48e3);
    m.copyToChannel(new Float32Array(which), 0, 0);
    var src = context.createBufferSource();
    var panner = context.createStereoPanner();
    src.buffer = m;
    src.connect(panner);
    panner.pan.value = location ? Math.cos(angle_between(location, camera.position) + camera.theta + Math.PI/2) : 0;;
    panner.connect(context.destination)
    src.start(); // QQ
    return src;
};

var musicnotes;
var music_timeouts=[];
function doplay() {
    if (music_timeouts.length < 2 && !going_back && can_play_music) {
        musicnotes.map((note,i) =>
                       note.map(n=>music_timeouts.push(setTimeout(_ => {
                           music_timeouts.shift();
                           play(n, NewVector(20,-40,0));
                           if (music_timeouts.length == 1) {
                               doplay();
                           }
                       }, i*200+400)))
                      )
    }
}

var toaudio = x => transpose(x).map(sum);

function load() {
    var melody =  [null, 19, 17, 19, 15, 19, 14, 19, 12, 19, 11, 19, 12, 19, 14, 19, 15, 19, 7, 19, 9, 19, 11, 19, 12, 19, 11, 19, 12, 19, 14, 19];
    var harmony_2 =  [15, 16, 17, 10, 8, 7, 8, 10, 12, 4, 5, 7, 8, 7, 8, 4];
    var melody_4 =  [20, 24, 20, 24, 25, 17, 25, 17, 22, 19, 22, 19, 24, 15, 24, 15, 20, 17, 20, 17, 23, 14, 23, 14, 19, 15, 19, 15, 17, 11, 17, 11, 15, 12, 15, 12, 14, 8, 14, 8];
    var harmony_4 =  [5, 17, 5, 17, 12, 17, 12, 17, 10, 13, 10, 13, 10, 13, 10, 13, 10, 15, 10, 15, 10, 15, 10, 15, 8, 12, 8, 12, 8, 12, 8, 12, 8, 14, 8, 14, 8, 14, 8, 14, 7, 11, 7, 11, 7, 11, 7, 11, 3, 12, 3, 12, 3, 12, 3, 12, 2, 8, 2, 8, 2, 8, 2, 8, 0, 19, 0, 19, 0, 19, 0, 19, 2, 5, 2, 5, 2, 5, 2, 5];
    var harmony_9 =  [3, 2, 0, 5, 3, 2, 3, -1, 0, -1, 0, 2, 3, 2, 3, -1];

    var melody_11 =  [15, 19, 14, 19, 12, 19, 10, 19, 8, 19, 10, 19, 12, 17, 20, 17, 14, 17, 12, 17, 10, 17, 20, 17, 7, 17, 8, 17, 10, 15, 7, 15, 12, 15, 10, 15, 8, 15, 7, 15, 5, 15, 19, 15, 8, 14, 5, 14, 11, 14, 8, 14, 7, 14, 5, 14, 3, 14, 5, 14];
    var harmony_11_up =  [7, 12, 12, null, 10, 10, 10, null, 9, 9, 9, null, 7, 7, 7];
    var harmony_11_down =  [0, 3, 5, null, -2, 2, 3, null, -4, 0, 2, null, -5, -1, 12];

    var final_melody =  [19, 24, 15, 24, 14, 26, 14, 26, 15, 24, 15, 24, 20, 23, 20, 23, 19, 24, 15, 24, 14, 26, 14, 26, 15, 24, 15, 24];
    var final_harmony_up =  [null, 12, 11, 11, 12, 12, 14, null, null, 12, 11, 11, 12, 12, 14];
    var final_harmony_down =  [null, 3, 8, 8, 7, 7, 17, null, null, 7, 8, 8, 7, 7, 6];


    /* offset of melody, duration of melody, duration of harmony, melody, harmony */
    var arr = [
        [0, 1, 1, melody],
        [5, 1, 2, melody, harmony_2],
        [0, 2, 1, melody_4, harmony_4],
        [12, 1, 2, melody, harmony_9],
        [12, 1, 4, melody_11, harmony_11_up, harmony_11_down],
        [0, 1, 2, final_melody, final_harmony_up, final_harmony_down]
    ]

    musicnotes = range(300).map(_=>[])

    var addnote = (kind, note, where, length) => {
        if (note == null) return;
        var time = length * 0.11+.13;
        musicnotes[where+offset].push(toaudio([note/12, note/12-1].map(f=> {
            f=2**(f/2) * .25;
            return kind ? 
                jsfxr([3,0.1,time,0.1,0.3,f,,,,,,,,0.5,,,-1,,0.2,,,,,0.1])
                :
                jsfxr([3,0.1,time+.07,.3,0.5,f,,,,,,,,,,,,,0.15,,,,,0.1])
        })))
    }


    
    var offset = 0;

    var donext = _ => {
        var [offset_melody, duration_melody, duration_harmony, ...music] = arr.shift()
        music.map((notes,j)=>notes.map(
            (note,i) => addnote(!j && arr.length < 5,
                                note==null?null:note+offset_melody*(!j),
                                i*(j?duration_harmony:duration_melody),
                                (j?duration_harmony:duration_melody))))
        offset += duration_melody*music[0].length;
        jQ.innerHTML = (6-arr.length)+"/6"
        setTimeout(arr.length ? donext : main_go,1)
    }
    setTimeout(donext,1)
}

var arr;
function setup_audio() {
    load()
    arr = [100, 7, 55, 25, 35, 20, , 15, , , 4, , , , 2, 33, -8, -23, 20, , 23, 4, -48, 30,
           100, , 5, 100, 55, 20, , , -10, , , , , , , , -40, -5, 15, , , , , 30,
           , , 5, 100, 55, 20, , , -10, , , , , , , , -40, -5, 15, , , , , 30,
           300, 10, 25, 5, 20, 25, 10, , , 50, , , , 50, , , , , 10, , 50, 50, , 60,
           300, 5, 15, 5, 20, 25, 10, , , 50, , , , 50, , , , , 10, , 50, 50, , 60,
           300,45,55,,55,15,,-10,,,,,,,,,,,25,,,,,30,
           0,5,5,,45,5,,-10,,,,,,,,,-25,,5,,,,,300]
    arr = reshape(arr.map(x=>x/100),24)


    sounds.boom = toaudio([jsfxr(arr[0])]);
    sounds.gun = toaudio([jsfxr(arr[1]),jsfxr(arr[2])]);
    sounds.collect  = toaudio([jsfxr(arr[3])])
    sounds.collect2 = toaudio([jsfxr(arr[4])])
    sounds.clock = toaudio([jsfxr(arr[5]), jsfxr(arr[5]).slice(2000)])
    sounds.hit = toaudio([jsfxr(arr[6]),jsfxr(arr[1])])
}
