var myPosLatLong = null

var geoWatch;
function startWatch() { 

    if ( !geoWatch ) { 
        if ( "geolocation" in navigator && "watchPosition" in navigator.geolocation ) { 
            geoWatch = navigator.geolocation.watchPosition( setCurrentPosition, positionError, { 
                enableHighAccuracy: true, timeout: 15000, maximumAge: 0 
            }); 
            console.log('--> START Geolocation')
        } 
        else {
          // Browser doesn't support Geolocation
          console.log('ERROR Geolocation')
        }
    }

    return geoWatch
}

function setCurrentPosition(position) {
  var lat = position.coords.latitude;// + (cont+=.001);
  var lng = position.coords.longitude;
  //preparo posicion GPS
  let posicion = [lat, lng];
  setGPSPos(posicion)
  console.log(posicion)
}

function positionError() {
  console.log('ERROR getCurrentPosition')
}

function stopWatch() { 
    navigator.geolocation.clearWatch( geoWatch ); 
    geoWatch = undefined;
    console.log('--> STOP Geolocation')
}



function getGPSPos() {
    return myPosLatLong
}

function setGPSPos(pos) {
    myPosLatLong = pos
}

function toggleGPS() {
    //console.log('toggleGPS', geoWatch)
    if(!geoWatch) {
        geoWatch = startWatch()
    }
    else stopWatch()
}

function getGPS() {
    return geoWatch
}
