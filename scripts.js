const guitarAudioFiles = [
    'duet - omori.mp3',
    'duvet - boa.mp3',
    'for lovers - lamp.mp3',
    'that band intro - bocchitherock.mp3',
    'main actor - minami.mp3',
    'spy x family opening.mp3',
    'flashbacker - bocchitherock.mp3',
    'despair.mp3',
    'peaceful sleep - nier.mp3',
];

const songAudioFiles = [
    'adventure.mp3',
    'anime opening 1.mp3',
    'anime opening 2.mp3',
    'mikhail.mp3',
    'burning circuits.mp3',
    'steel haze.mp3',
    'trouble thinking.mp3',
    'heaven\'s dismissal.mp3',
    'peaceful day - Trashy Collector.mp3',
    'busy beach - Trashy Collector.mp3',
];

const note = document.getElementById('note');
const titleHeader = document.getElementById('title');

const hoverText = document.getElementById('hover-text');
const mainInteract = document.getElementById('main-interact');

const mainAudio = document.getElementById('main-audio');
const mainTrack = document.getElementById('main-track');

const currentTime = document.getElementById('left-time');
const endDuration = document.getElementById('right-time');

const progressBar = document.getElementById('progress-bar');
const progressSlider = document.getElementById('progress-slider');

const volumeBar = document.getElementById('volume-bar');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

const interactButtons = [mainInteract];
const mainInteraction = interactButtons[0];
let currentInteraction = null;

function createAudioCard(filename, folder) {
    const card = document.createElement('div');
    card.className = 'card py-[10px] mt-[10px] flex';

    const interact = document.createElement('button');
    interact.className = 'material-symbols-outlined w-[10%]';
    interact.innerHTML = 'play_arrow';
    card.appendChild(interact);
    interactButtons.push(interact);

    const title = document.createElement('h3');
    title.className = 'px-[10px] w-[70%]'
    title.textContent = filename.replace('.mp3', '');
    card.appendChild(title);

    const audio = document.createElement('audio');
    // audio.controls = true;
    card.appendChild(audio);

    const source = document.createElement('source');
    source.src = `Assets/Audio/${folder}/${filename}`;
    source.type = 'audio/mpeg';
    audio.appendChild(source);

    audio.preload = 'metadata';
    audio.addEventListener('loadedmetadata', () => {
        const time = document.createElement('span');
        time.className = 'pr-[20px] w-[20%] text-end'
        time.textContent = formatDuration(audio.duration);
        card.appendChild(time);
    });

    return card;
}

// function createAudioCard(filename, folder) {
//     const card = document.createElement('div');
//     card.className = 'py-[10px] flex flex-col justify-center';

//     const title = document.createElement('h3');
//     title.textContent = filename.replace('.mp3', '');
//     card.appendChild(title);

//     const audio = document.createElement('audio');
//     audio.controls = true;

//     const source = document.createElement('source');
//     source.src = `Assets/Audio/${folder}/${filename}`;
//     source.type = 'audio/mpeg';
//     audio.appendChild(source);

//     audio.appendChild(document.createTextNode('Your browser does not support the audio element.'));
//     card.appendChild(audio);

//     return card;
// }

function populateList(files, id, folder) {
    const container = document.getElementById(id);
    if (!container) return;

    files.forEach((filename) => {
        const card = createAudioCard(filename, folder);
        container.appendChild(card);
    });
}

function formatDuration(duration) {
    if (!Number.isFinite(duration) || duration <= 0) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function interactMouseEnter(button) {
    const rect = button.getBoundingClientRect();
    if (button.innerHTML == 'play_arrow') hoverText.textContent = 'Play';
    else hoverText.textContent = 'Pause';

    hoverText.style.left = `${rect.right + 8}px`;
    hoverText.style.top = `${rect.top}px`;
    hoverText.style.visibility = 'visible';
}

function interactMouseLeave() {
    hoverText.style.visibility = 'hidden';
}

function interactClick(button) {   
    const previousInteraction = currentInteraction;
    let currentCard = null;

    //set current interaction
    if (currentInteraction === null || button !== mainInteraction) currentInteraction = button;
    console.log(previousInteraction, currentInteraction)

    //no selected track
    if (currentInteraction === null) {console.log("choose a track!"); return;}

    //same track
    if (currentInteraction == previousInteraction) {
        toggleInteraction(mainInteraction);
        if (mainAudio.paused) mainAudio.play();
        else mainAudio.pause();
    }
    //dif track
    else if (currentInteraction != previousInteraction) {
        const card = currentInteraction.parentElement;
        const title = card.querySelector('h3');
        const duration = card.querySelector('span');
        const source = card.querySelector('source');

        currentCard = card;
        card.classList.add('card-selected');

        mainTrack.textContent = title.textContent;
        endDuration.textContent = duration.textContent;
        currentTime.textContent = "0:00";
        mainAudio.src = source.src;
        mainAudio.load();
        mainAudio.play();
        mainInteraction.innerHTML = "pause";
    }
    toggleInteraction(currentInteraction);

    //set other tracks to not playing
    for (let i = 1; i < interactButtons.length; i++) {
        const element = interactButtons[i];
        const card = element.parentElement;
        if (element !== currentInteraction) element.innerHTML = "play_arrow";
        if (card !== currentCard && card.classList.contains('card-selected')) card.classList.remove('card-selected');
    }

}

function toggleInteraction(interaction) {
    if (interaction.innerHTML == 'play_arrow') interaction.innerHTML = "pause";
    else interaction.innerHTML = "play_arrow";
}

function positionHoverText(event) {
    hoverText.style.left = `${event.clientX + 10}px`;
    hoverText.style.top = `${event.clientY - 20}px`;
}

function main() {
    interactMouseLeave();

    populateList(guitarAudioFiles, 'guitar-list', "Guitar")
    populateList(songAudioFiles, 'songs-list', "Songs")

    interactButtons.forEach(button => {
        if (window.innerWidth > 768) {
            button.addEventListener('mouseenter', () => interactMouseEnter(button));
            button.addEventListener('mousemove', positionHoverText);
            button.addEventListener('mouseleave', interactMouseLeave);
        }
        button.addEventListener('click', () => interactClick(button))
    });

    main.volume = 0.5;
    progressSlider.value = 0;
    volumeSlider.value = 50;

    mainAudio.addEventListener('timeupdate', () => {
        currentTime.textContent = formatDuration(mainAudio.currentTime);
        const percentage = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        progressSlider.value = percentage;
    });

    progressSlider.addEventListener('input', () => {
        //cur over max = slidervalue / 100
        mainAudio.currentTime = progressSlider.value/100 * mainAudio.duration;
    });

    volumeSlider.addEventListener('input', () => {
        mainAudio.volume = volumeSlider.value/100;
        if (mainAudio.volume <= 0.5 && mainAudio.volume > 0) volumeIcon.innerHTML = 'volume_down';
        else if (mainAudio.volume <= 1 && mainAudio.volume > .5) volumeIcon.innerHTML = 'volume_up';
        else if (mainAudio.volume <= 0) volumeIcon.innerHTML = 'volume_off';
    });

}

window.addEventListener('DOMContentLoaded', main);