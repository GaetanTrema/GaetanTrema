document.querySelector('button').addEventListener('click', () => {

    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["729a250b-e7f5-4a4e-88c1-78b5d405ec52"] // Mets ton UUID ici une fois trouvé
    })
    .then(device => device.gatt.connect())
    .then(server => server.getPrimaryServices())
    .then(services => {
        services.forEach(service => {
        console.log('Service trouvé:', service.uuid);
        });
    });
});