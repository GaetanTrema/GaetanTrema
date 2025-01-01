const button1Audio = new Audio("./1.mp3");
const button2Audio = new Audio("./2.mp3");

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');

button1Audio.addEventListener("canplaythrough", (event) => {
    button1.addEventListener('click', () => {
        reset();
        button1Audio.play();
    });
});

button2Audio.addEventListener("canplaythrough", (event) => {
    button2.addEventListener('click', () => {
        reset();
        button2Audio.play();
    });
});

function reset() {
    button1Audio.currentTime = 0;
    button1Audio.pause();
    button2Audio.currentTime = 0;
    button2Audio.pause();
}