function registrarServiceWorker() {
    if('serviceWorker' in navigator) {
        this.navigator.serviceWorker.register('./sw.js')
        .then( reg => {
            console.log('El service worker se registró correctamente', reg)
        })
        .catch( err => {
            console.log('Error al registrar el service worker', err)
        })
    }
    else {
        console.error('serviceWorker no está disponible en este navegador')
    }
}

function start() {
    console.log('start...')
    registrarServiceWorker()

    document.querySelectorAll('header button')[7].innerHTML = startWatch()? 
    '<span class="material-icons">gps_fixed</span>':
    '<span class="material-icons">gps_off</span>'
    
    getGeoData(iniMap)

    fetch('/version').then(r => r.json()).then( rta => {
        document.querySelector('title').textContent += ` ${rta.version}`
    })
}

window.onload = start