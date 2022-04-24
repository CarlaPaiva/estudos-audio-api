const input = document.querySelector('#fileInput');

const audioContext = new AudioContext();
const audioElement = document.createElement('audio');   
 
// cria um MediaElement a partir do context e do input audio
const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();


input.addEventListener('change', () => {

    // cria elemento audio com arquivo escolhido
    audioElement.id       = 'audio-player';
    audioElement.src= URL.createObjectURL(input.files[0]);
    audioElement.type     = 'audio/mpeg';
    document.querySelector('body').appendChild(audioElement);

    audioResources();
});

function playPause(){
    // liga o MEdiaElement a um output
    track.connect(audioContext.destination);

    const playButton = document.querySelector('button');

    playButton.addEventListener('click', () => {

        if (audioContext.state === 'suspended'){
            audioContext.resume();
        }

        if (audioElement.paused){
            audioElement.play();
        } else {
            audioElement.pause();
        }
    });
}

function volumeControls(){
    // ligação de node de ganho (volume)
    track.connect(gainNode).connect(audioContext.destination);

    const volumeControl = document.querySelector('#volume');
    volumeControl.addEventListener('input', () => {
        let vol = parseFloat(volumeControl.value);

        // se o input mandar 0, pegar o menor valor possível pra mutar o som
        if (vol == 0)
            vol = gainNode.gain.minValue;

        gainNode.gain.value = vol;
    });
}

function panControl(){
    const panner = new StereoPannerNode(audioContext, {pan: 0});
    const pannerControl = document.querySelector('#panner');
    pannerControl.addEventListener('input', () => {
        panner.pan.value = parseFloat(pannerControl.value);
    });

    track.connect(gainNode).connect(panner).connect(audioContext.destination);
}


function audioResources(){
    playPause();
    volumeControls();
    panControl();    
}