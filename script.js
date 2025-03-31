const button1Audio = new Audio("./1.mp3");
const button2Audio = new Audio("./2.mp3");

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const playground = document.querySelector('.playground');
const actionBar = document.querySelector('.action-bar');
const statusElement = document.querySelector('#status');
const playButton = document.querySelector('#start-btn');
const connectButton = document.querySelector('#bt-connect-btn');

let motorCharacteristic;

button1Audio.addEventListener("canplaythrough", (event) => {
    button1.addEventListener('click', () => {
        reset();
        button1Audio.play();
        burstVibration();
    });
});

button2Audio.addEventListener("canplaythrough", (event) => {
    button2.addEventListener('click', () => {
        reset();
        button2Audio.play();
        burstVibration();
    });
});

function reset() {
    button1Audio.currentTime = 0;
    button1Audio.pause();
    button2Audio.currentTime = 0;
    button2Audio.pause();
}

const options = {
    acceptAllDevices: true,
    optionalServices: ["immediate_alert"]
};
connectButton.addEventListener('click', () => {
    navigator.bluetooth
    .requestDevice(options)
    .then(device => {
        console.log("device connected", device.name);
        connectButton.classList.add('hidden');
        updateStatus('Vibreur trouvé. Connexion...');
        return device.gatt.connect();
    })
    .then(server => {
        console.log('server connected', server.connected);
        updateStatus('Préparation...');
        return server.getPrimaryService("immediate_alert");
    })
    .then(service => {
        updateStatus('Préparation...');
        console.log("service connected", service.uuid);
        return service.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214');
    })
    .then(characteristic => {
        
        motorCharacteristic = characteristic;
        updateStatus('Vibreur prêt.');
        playButton.classList.remove('hidden');
        playButton.addEventListener('click', () => {
            playground.classList.remove('hidden');
            actionBar.classList.add('hidden');
        });
    })
    .catch((error) => alert(`Something went wrong. ${error}`));
});

let vibrating = false;
let lastHitTimestamp = 0;
const burstVibration = () => {
    
    lastHitTimestamp = Date.now();
    if (!vibrating) {
        motorCharacteristic.writeValue(Uint8Array.of(1));
        vibrating = true;
    }

    setTimeout(() => {
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastHitTimestamp >= 1000) {
            motorCharacteristic.writeValue(Uint8Array.of(0));
            vibrating = false;
        }
    }, 1000);
}



const updateStatus = (status) => {
    statusElement.innerHTML = status;
}