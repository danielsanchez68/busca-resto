function getGeoData(inimap) {
    let xhrRestaurantes = new XMLHttpRequest
    xhrRestaurantes.open('get', 'restaurantes.geojson')
    xhrRestaurantes.addEventListener('load', () => {
        if (xhrRestaurantes.status == 200) {
            let respuesta = JSON.parse(xhrRestaurantes.response)
            let geoRestaurantes = respuesta.features

            let xhrBarrios = new XMLHttpRequest
            xhrBarrios.open('get', 'barrios.geojson')
            xhrBarrios.addEventListener('load', () => {
                if (xhrBarrios.status == 200) {
                    let respuesta = JSON.parse(xhrBarrios.response)
                    let geoBarrios = respuesta.features
                    
                    setGPSPos([
                        -34.60653495400229,
                        -58.43543171882629

                    ])
                    //console.log(getGPSPos())
                    inimap(geoRestaurantes, geoBarrios)
                }
            })
            xhrBarrios.send()
        }
    })
    xhrRestaurantes.send()
}