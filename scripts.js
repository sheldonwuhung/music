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

function createAudioCard(filename, folder) {
    const card = document.createElement('div');
    card.className = 'py-[10px] flex flex-col justify-center';

    const title = document.createElement('h3');
    title.textContent = filename.replace('.mp3', '');
    card.appendChild(title);

    const audio = document.createElement('audio');
    audio.controls = true;

    const source = document.createElement('source');
    source.src = `Assets/Audio/${folder}/${filename}`;
    source.type = 'audio/mpeg';
    audio.appendChild(source);

    audio.appendChild(document.createTextNode('Your browser does not support the audio element.'));
    card.appendChild(audio);

    return card;
}

function populateList(files, id, folder) {
    const container = document.getElementById(id);
    if (!container) return;

    files.forEach((filename) => {
        const card = createAudioCard(filename, folder);
        container.appendChild(card);
    });
}

function main() {
    populateList(guitarAudioFiles, 'guitar-list', "Guitar")
    populateList(songAudioFiles, 'songs-list', "Songs")
}

window.addEventListener('DOMContentLoaded', main);
