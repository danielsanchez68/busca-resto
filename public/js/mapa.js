const ZOOM_MIN = 0
const ZOOM_MAX = 19
let zoom = 14

var info = false
function setInfo(enable) {
    info = enable
}
function getInfo() {
    return info
}

mapaZoom = null
function setMapaZoom(enable) {
    mapaZoom = enable
}
function getMapaZoom() {
    return mapaZoom
}

zoom = null
function setZoom(enable) {
    zoom = enable
}
function getZoom() {
    return zoom
}

let barrios = false
let restos = false


function representarMiPos(m,pos) {
    //return L.marker(pos,{draggable: true}).addTo(m);
    return L.circleMarker(pos, {
        radius: 10,
        fillColor: "#0000FF",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.4,
        draggable: true
    }).bindTooltip('YO', { permanent: true, offset: [-10, -10] }).addTo(m);
}

function representarMiArea(m,pos,radio) {
    return L.circle(pos, radio).addTo(m)
    //return L.marker(pos,{draggable: false}).addTo(map);
}

function representarRestaurantesProximos(m,restaurantes,mostrarNombres) {
    /* var marker = { 
        "type": "FeatureCollection",
        "features": [
            { 
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                        "coordinates": restaurantes[0].geometry.coordinates
                } 
            }
        ] 
    }    
    return L.geoJson(marker).addTo(m); */

    /* var pos = [...restaurantes[0].geometry.coordinates]
    //console.log(pos)
    //return L.marker(pos.reverse(),{draggable: false}).addTo(m);
    return L.circleMarker(pos.reverse(), {
        radius: 10,
        fillColor: "#FF0000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    }).bindTooltip('R', { permanent: true, offset: [-10, -10] }).addTo(m); */

    
    /* var markers = restaurantes.map( (restaurante, index) => {
        var pos = [...restaurante.geometry.coordinates]
        return L.circleMarker(pos.reverse(), {
            radius: 10,
            fillColor: "#FF0000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        //}).addTo(m);
        }).bindTooltip(''+(index + 1), { permanent: true, offset: [0, 0] }).addTo(m);
    }) */
   

    var markers = []
    restaurantes.forEach( (restaurante,index) => {
        var pos = [...restaurante.geometry.coordinates]
        var marker = L.circleMarker(pos.reverse(), {
            radius: 10,
            fillColor: "#FF0000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        })
        if(mostrarNombres) {
            marker.bindTooltip(`${index + 1}. ${restaurante.properties.nombre}`, { permanent: true, offset: [-10, -10] })
        }
        markers.push(marker.addTo(m))
    })


    return markers
}

function borrarRestaurantesProximos(m,markers) {
    markers.forEach(maker => {
        m.removeLayer(maker)
    })
}

function representarRestaurantes(m, georestaurantes) {
    return L.geoJson(georestaurantes, {
        pointToLayer: function (feature, latlng) {
            let label = feature.properties.nombre
            return new L.circleMarker(latlng, {
                radius: 10,
                fillColor: "#00FF00",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            })//.bindTooltip(label, { permanent: true, offset: [0, 12] })
        }
    }).addTo(m);
}

function representarBarrios(m, geobarrios) {
    return L.geoJson(geobarrios).addTo(m);
}

function centrarMapa(m,pos) {
    m.setView(pos, getZoom(), { animation: true });
}

function enableZoomMapa(m,enable) {
    if(enable) {
        m.touchZoom.enable();
        m.doubleClickZoom.enable();
        m.scrollWheelZoom.enable();
        m.boxZoom.enable();
        m.keyboard.enable();
        $(".leaflet-control-zoom").css("visibility", "visible");
    }
    else {
        m.touchZoom.disable();
        m.doubleClickZoom.disable();
        m.scrollWheelZoom.disable();
        m.boxZoom.disable();
        m.keyboard.disable();
        $(".leaflet-control-zoom").css("visibility", "hidden");
    }
}

function iniControles(m) {
    document.querySelectorAll('header button').forEach((boton, index) => {
        boton.addEventListener('click', () => {
            //console.log('click en boton ' + index)
            if (index == 0) {
                let posicion = getGPSPos()
                posicion[0] += 0.0001
                setGPSPos(posicion)
            }
            else if (index == 1) {
                let posicion = getGPSPos()
                posicion[0] -= 0.0001
                setGPSPos(posicion)
            }
            else if (index == 2) {
                let posicion = getGPSPos()
                posicion[1] -= 0.0001
                setGPSPos(posicion)
            }
            else if (index == 3) {
                let posicion = getGPSPos()
                posicion[1] += 0.0001
                setGPSPos(posicion)
            }
            else if (index == 4) setZoom(getZoom() - 1)
            else if (index == 5) setZoom(getZoom() + 1)
            else if (index == 6) {
                setMapaZoom(!getMapaZoom())
                let mapazoom = getMapaZoom()
                document.querySelectorAll('header button')[4].disabled = mapazoom
                document.querySelectorAll('header button')[5].disabled = mapazoom
                enableZoomMapa(m,mapazoom)
            }
            else if (index == 7) {
                toggleGPS()
                let gps = getGPS()
                console.log(gps)
                document.querySelectorAll('header button')[0].disabled = gps
                document.querySelectorAll('header button')[1].disabled = gps
                document.querySelectorAll('header button')[2].disabled = gps
                document.querySelectorAll('header button')[3].disabled = gps

                document.querySelectorAll('header button')[7].innerHTML = gps? 
                    '<span class="material-icons">gps_fixed</span>':
                    '<span class="material-icons">gps_off</span>'
            }
            else if (index == 8) {
                barrios = !barrios
                document.querySelectorAll('header button')[8].innerHTML = barrios? 
                    '<span class="material-icons">web_asset</span>' :
                    '<span class="material-icons">space_dashboard</span>'
            }
            else if (index == 9) {
                restos = !restos
                document.querySelectorAll('header button')[9].innerHTML = restos? 
                    '<span class="material-icons">room</span>' :
                    '<span class="material-icons">hide_source</span>'
            }
            else if (index == 10) {
                setInfo(!getInfo())
                let info = getInfo()
                document.querySelectorAll('header button')[10].innerHTML = info? 
                    '<span class="material-icons">privacy_tip</span>':
                    '<span class="material-icons">live_help</span>'
            }
            let zoom = getZoom()
            if (zoom > ZOOM_MAX) setZoom(ZOOM_MAX)
            if (zoom < ZOOM_MIN) setZoom(0)
            //console.log(zoom)
        })
    })
}

function iniMap(geoRestaurantes, geoBarrios) {
    //console.log(geoRestaurantes)
    //console.log(geoBarrios)
    //console.log(posicion)

    setZoom(16)
    let posicion = getGPSPos()
    var map = L.map('map').setView([...posicion].reverse(), getZoom());
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://cloudmade.com">CloudMade</a>',
        maxZoom: ZOOM_MAX
    }).addTo(map);

    L.control.scale().addTo(map);

    enableZoomMapa(map,getMapaZoom())
    iniControles(map)

    $(".leaflet-control-scale-line").css("visibility", "hidden");
    $(".leaflet-control-attribution").css("visibility", "hidden");

    setBarrio(nombreBarrioActual)

    /* ----------------------------------------------------------------------- */
    //representaciones en el mapa
    //representarRestaurantes(map, geoRestaurantes)
    //representarBarrios(map, geoBarrios)
    //if(location.search.slice(1) != 'nobarrios' )representarBarrios(map, geoBarrios)  

    /* ----------------------------------------------------------------------- */
    //ticks
    mapTick(250,map, geoBarrios, geoRestaurantes)
    comuTick(1000)
}

function getDistancia() {
    return Number(document.querySelectorAll('header input')[0].value)
}

function setBarrio(nombre) {
    if(nombre) document.querySelectorAll('header input')[1].value = nombre
}


function sendPosicionDistancia(posicion, distancia, cb) {
    //console.log(posicion, distancia)

    fetch('/datos', {
        method: 'POST',
        body: JSON.stringify({posicion, distancia,timestamp: Date.now()}),
        headers: {
            'Content-Type': 'application/json'
        }
     })
     .then(r => r.json())
     .then( datos => {
        //console.log(datos)
        if(cb) cb(datos)
    })
    .catch(console.error)
}

function mapTick(time,m,geoBarrios, geoRestaurantes) {
    var myArea = null
    var myMarker = null
    var myBarrios = null
    var myRestos = null
    var markerRestaurantes = []
    var markerRestaurantesAnt = null
    var restosAnt = restos

    setInterval(() => {
      
        if(myArea) m.removeLayer(myArea);
        if(myMarker) m.removeLayer(myMarker);
        if(myBarrios) m.removeLayer(myBarrios);

        if(barrios) myBarrios = representarBarrios(m, geoBarrios)
        if(restos) {
            if(restos != restosAnt) {
                myRestos = representarRestaurantes(m, geoRestaurantes)
                restosAnt = restos
            }
        }
        else {
            if(restos != restosAnt) {
                if(myRestos) m.removeLayer(myRestos);
                restosAnt = restos
            }
        }

        if(restos) {
            let restaurantesCopy = [...restaurantes]

            if(markerRestaurantesAnt) borrarRestaurantesProximos(m,markerRestaurantesAnt)
            if(restaurantesCopy.length) {
                markerRestaurantes = representarRestaurantesProximos(m,restaurantesCopy,info)
            }
            markerRestaurantesAnt = [...markerRestaurantes]
        }
        else {
            if(markerRestaurantesAnt) borrarRestaurantesProximos(m,markerRestaurantesAnt)
        }

        setBarrio(nombreBarrioActual)

        let posicion = getGPSPos()
        myArea = representarMiArea(m, posicion, getDistancia())
        myMarker = representarMiPos(m, posicion)
        if (!mapaZoom) centrarMapa(m,posicion)
    }, time)    
}

let restaurantes = []
let nombreBarrioActual = ''
function comuTick(time) {
    setInterval(() => {
        sendPosicionDistancia(getGPSPos(), getDistancia(), datos => {
            //console.log(datos)
            if(Array.isArray(datos.restaurantes)) {
                restaurantes = datos.restaurantes         
            }
            else restaurantes = []

            nombreBarrioActual = datos.barrio
        })
    },time)
}
