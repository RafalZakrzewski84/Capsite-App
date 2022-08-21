/** @format */

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/dark-v10', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 6, // starting zoom
	projection: 'globe', // display the map as a 3D globe
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('style.load', () => {
	map.setFog({
		color: 'rgb(186, 210, 235)', // Lower atmosphere
		'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
		'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
		'space-color': 'rgb(11, 11, 25)', // Background color
		'star-intensity': 0.6, // Background star brightness (default 0.35 at low zoooms )
	});
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
	`<h5>${campground.title}</h5><p>${campground.location}</p>`
);

const marker = new mapboxgl.Marker({ color: 'black' })
	.setLngLat(campground.geometry.coordinates)
	.setPopup(popup)
	.addTo(map);
