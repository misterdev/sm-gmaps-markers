import GoogleMapsApi from '../libs/GoogleMapsApi'
import '../libs/markerclusterer'

import * as img from '../assets/marker.png'
import data from '../assets/varchi.json'

const gmapApi = new GoogleMapsApi(process.env.MAPS_API_KEY)

gmapApi.load().then(() => {

    const mapDiv = document.getElementById('map')

    const locations = data.features.map((f) => ({
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        name: f.properties.name
    }))

    const map = new MyMap(mapDiv, locations)

})

class MyMap {

    constructor(mapDiv, locations) {
        this.showMarkers = false
        this.showHeatmap = false
        this.showCluster = false

        this.locations = locations

        this.map = new google.maps.Map(mapDiv, {
            center: new google.maps.LatLng(44.496817, 11.343110),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        // MARKERS
        this.markers = this.locations.map((loc) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.lat, loc.lng),
                map: null,
                title: loc.name
            })

            const infoWindow = new google.maps.InfoWindow({
                content: loc.name
            })

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(this.map, marker)
            })
            return marker
        })

        // HEATMAP 
        const heatmapData = this.locations.map((loc) => ({
            location: new google.maps.LatLng(loc.lat, loc.lng),
            weight: .5
        }))

        this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 25
        })

        document.getElementById('markers-btn').onclick = this.toggleMarkers.bind(this)
        document.getElementById('heatmap-btn').onclick = this.toggleHeatMap.bind(this)
        document.getElementById('cluster-btn').onclick = this.toggleClusterMarkers.bind(this)
    }

    toggleMarkers() {
        this.showMarkers = !this.showMarkers
        this.markers.map((m) => m.setMap(this.showMarkers ? this.map : null))
    }

    toggleHeatMap() {
        this.showHeatmap = !this.showHeatmap
        this.heatmap.setMap(this.showHeatmap ? this.map : null)
    }

    toggleClusterMarkers() {
        this.showCluster = !this.showCluster
        if (this.showCluster) {
            this.cluster = new MarkerClusterer(this.map, this.markers, {
                gridSize: 100,
                zoomOnClick: true,
                imagePath: img,
                style: {
                    textColor: 'white'
                }
            })
        } else {
            this.showMarkers = false
            this.cluster.clearMarkers()
        }
    }
}