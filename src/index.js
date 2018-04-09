import GoogleMapsApi from '../libs/GoogleMapsApi'
import '../libs/markerclusterer'

import data from './varchi.json'

const gmapApi = new GoogleMapsApi(process.env.SM_MAPS_API_KEY);

gmapApi.load().then(() => {

    const mapDiv = document.getElementById('map')
    const options = {
        center: new google.maps.LatLng(44.496817, 11.343110),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    const map = new google.maps.Map(mapDiv, options)

    const locations = data.features.map((f) => ({
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        name: f.properties.name
    }))

    const markers = createMarkers(map, locations)
    const heatmap = createHeatMap(map, locations)
    const cluster = createClusterMarkers(map, markers)
})

function createMarkers(map, locations) {
    return locations.map((loc) => {
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(loc.lat, loc.lng),
            map: map,
            title: loc.name
        })

        const infoWindow = new google.maps.InfoWindow({
            content: loc.name
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
        });
        return marker
    })
}

function createHeatMap(map, locations) {
    const heatmapData = locations.map((loc) => ({
        location: new google.maps.LatLng(loc.lat, loc.lng),
        weight: .5
    }))

    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 25
    })

    return heatmap.setMap(map)
}

function createClusterMarkers(map, markers) {
    const style = {
        textColor: 'white'
    }

    return new MarkerClusterer(map, markers, {
        gridSize: 100,
        zoomOnClick: true,
        imagePath: 'https://github.com/googlemaps/js-marker-clusterer/blob/gh-pages/images/m3.png?raw=true',
        style
    })
}