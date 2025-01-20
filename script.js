const button1Audio = new Audio("./1.mp3");
const button2Audio = new Audio("./2.mp3");

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');

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
document.querySelector('#bt-connect-btn').addEventListener('click', () => {
    navigator.bluetooth
    .requestDevice(options)
    .then(device => {
        console.log("device connected", device.name);
        return device.gatt.connect();
    })
    .then(server => {
        console.log('server connected', server.connected);
        return server.getPrimaryService("immediate_alert");
    })
    .then(service => {
        console.log("service connected", service.uuid);
        return service.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214');
    })
    .then(characteristic => {

        motorCharacteristic = characteristic;
    })
    .catch((error) => alert(`Something went wrong. ${error}`));
});

const burstVibration = () => {
    motorCharacteristic.writeValue(Uint8Array.of(1));
    setTimeout(() => {
        motorCharacteristic.writeValue(Uint8Array.of(0));
    }, 1000);
}