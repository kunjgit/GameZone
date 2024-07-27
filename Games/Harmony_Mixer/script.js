const audioUpload = document.getElementById('audio-upload');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
const pitchControl = document.getElementById('pitch');
const volumeControl = document.getElementById('volume');
const filterControl = document.getElementById('filter');
const balanceControl = document.getElementById('balance');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const resetSettingsButton = document.getElementById('reset-settings');
const seekBar = document.getElementById('seek-bar');
const uploadImage = document.getElementById('upload-image');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser, bufferLength, dataArray, source, gainNode, pannerNode, filterNode, buffer, isPlaying = false, startTime = 0, pausedAt = 0;

audioUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        if (isPlaying) {
            pauseAudio(); // Stop the audio when a new file is uploaded
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            audioCtx.decodeAudioData(e.target.result, function(decodedData) {
                buffer = decodedData;
                initAudio();
                seekBar.max = buffer.duration;
                seekBar.value = 0;  // Reset seek bar to beginning
                pausedAt = 0;       // Reset pausedAt to beginning
                startAudio();       // Play audio automatically after file is uploaded
            });
        };
        reader.readAsArrayBuffer(file);
        uploadImage.src = './Assets/Upload-2.png';
    }
});

function initAudio() {
    gainNode = audioCtx.createGain();
    gainNode.gain.value = volumeControl.value;

    pannerNode = audioCtx.createStereoPanner();
    pannerNode.pan.value = balanceControl.value;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = filterControl.value;

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    gainNode.connect(pannerNode);
    pannerNode.connect(filterNode);
    filterNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    pitchControl.addEventListener('input', function() {
        if (source) {
            source.detune.value = (this.value - 1) * 1000; // detune in cents
        }
    });

    volumeControl.addEventListener('input', function() {
        if (gainNode) {
            gainNode.gain.value = this.value;
        }
    });

    filterControl.addEventListener('input', function() {
        if (filterNode) {
            filterNode.frequency.value = this.value;
        }
    });

    balanceControl.addEventListener('input', function() {
        if (pannerNode) {
            pannerNode.pan.value = this.value;
        }
    });

    resetSettingsButton.addEventListener('click', function() {
        pitchControl.value = 1;
        volumeControl.value = 1;
        filterControl.value = 20000; // default value
        balanceControl.value = 0;

        if (source) {
            source.detune.value = 0;
        }
        if (gainNode) {
            gainNode.gain.value = 1;
        }
        if (pannerNode) {
            pannerNode.pan.value = 0;
        }
        if (filterNode) {
            filterNode.frequency.value = 1000;
        }

    });

    seekBar.addEventListener('input', function() {
        if (isPlaying) {
            pauseAudio();
            pausedAt = parseFloat(this.value);
            startAudio();
        } else {
            pausedAt = parseFloat(this.value);
        }
    });
}

function startAudio() {
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.detune.value = (pitchControl.value - 1) * 1000;

    source.connect(gainNode);

    source.start(0, pausedAt);
    startTime = audioCtx.currentTime - pausedAt;
    isPlaying = true;
    draw();
}

function pauseAudio() {
    if (source) {
        source.stop();
        source.disconnect();
    }
    pausedAt = audioCtx.currentTime - startTime;
    isPlaying = false;
}

playButton.addEventListener('click', function() {
    if (!isPlaying) {
        startAudio();
    }
});

pauseButton.addEventListener('click', function() {
    if (isPlaying) {
        pauseAudio();
    }
});

function draw() {
    if (!isPlaying) return;
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        // Calculate color
        const shade = 255 - (barHeight * 2); // Reverse the height to get a lighter color
        canvasCtx.fillStyle = `rgb(${shade}, ${shade}, 255)`; // Shades of purple

        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }

    // Update seek bar
    seekBar.value = audioCtx.currentTime - startTime;
}
