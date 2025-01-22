// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties 
//of the leaflet map object L.map.
//the map window has been given the id 'map' in th<e .html file
var map = L.map('map', {
	center: [47.8, 13.05],
	zoom: 15
});

// alternatively the setView method could be used for placing the map in the window
//var map = L.map('map').setView([47.5, 13.05], 8);

// add open street map as base layer
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

var osmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});



// for using the two base maps in the layer control, I defined a baseMaps variable
var baseMaps = {
	"CartoDB_Positron": CartoDB_Positron,
	"OpenStreetMap": osmap 
};

//
//---- Part 2: Adding a scale bar
//

L.control.scale({position:'bottomright',imperial:false}).addTo(map);


//
//---- Part 3: Adding symbols ---- 

//Marker

var iconSize = [36, 36];

//1.Restaurants & Cafes
//1.1 Vegan restaurants	
var logo_vegrest = L.icon({
iconUrl: 'css/images/logo_vegrest.png',
iconSize: iconSize
});
//1.2 Vegetarian restaurants
var logo_vegerest = L.icon({
    iconUrl: 'css/images/logo_vegerest.png',
    iconSize: iconSize
});
//1.3 Vegan cafes
var logo_vegancafe = L.icon({
    iconUrl: 'css/images/logo_vegcafe.png',
    iconSize: iconSize
});
//1.4 Vegetarian only
var logo_vegonly = L.icon({
    iconUrl: 'css/images/logo_vegonly.png',
    iconSize: iconSize
});

//2. Shopping
//2.1 Marketplaces & Organic stores
var logo_shopping = L.icon({
iconUrl: 'css/images/logo_shopping.png',
iconSize: iconSize
});
//2.2 Second hand stores
var logo_secondhand = L.icon({
iconUrl: 'css/images/logo_secondhand.png',
iconSize: iconSize
});

//3. Recycling
var logo_recycle = L.icon({
    iconUrl: 'css/images/logo_recycle1.png',
    iconSize: iconSize
});


//Defining functions
//1. Highlight features
function highlightFeature(e) {
    var layer = e.target;
    var categoryIcon = e.target.options.icon.options.iconUrl; // Dynamisches Icon abrufen

    layer.setIcon(
        L.icon({
            iconUrl: categoryIcon, // Gleiches Icon, aber größer
            iconSize: [52, 52],
            iconAnchor: [26, 26],
            popupAnchor: [0, -26]
        })
    );
}

// 2. Reset highlights
function resetHighlight(e) {
    var layer = e.target;
    var categoryIcon = e.target.options.icon.options.iconUrl; // Dynamisches Icon abrufen

    layer.setIcon(
        L.icon({
            iconUrl: categoryIcon, // Zurück zum Original
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        })
    );
}
// 3. Zoom to features
function zoomToFeature(e) {
    map.setView(e.target.getLatLng(), 18); // Zentriert und zoomt auf den Punkt
}


//
//---- Part 4: adding features (polygons) from the geojson file 
//

//the variable districtsSBG is created in the Districts_Salzburg.js file (source file of geojson data)
//1.Restaurants & Cafes
//1.1 Vegetarian restaurants

var vegrest = L.geoJson(vegrest, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_vegerest,title: "Vegetarian options" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(<b>feature.properties.name</b>);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

vegrest.addTo(map);

//1.2 Vegan restaurants
var veganrest = L.geoJson(veganrest, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_vegrest, title: "Vegan options" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

veganrest.addTo(map);

//1.3 Vegetarian only

var vegonly = L.geoJson(vegonly, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_vegonly, title: "Only meatless options" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

vegonly.addTo(map);

//1.4 Vegan cafes

var vegancafe = L.geoJson(vegancafe, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_vegancafe, title: "Vegan options" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

vegancafe.addTo(map);

//2. Shopping
//2.1 Marketplaces & organic stores
var marketplace = L.geoJson(marketplace, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_shopping, title: "Marketplace" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

marketplace.addTo(map);

var organicstore = L.geoJson(organicstore, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_shopping, title: "Organic store" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

organicstore.addTo(map);

//2.2 Second hand store
var secondhand = L.geoJson(secondhand, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_secondhand, title: "Second hand store" });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('Name: ' + feature.properties.name);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

secondhand.addTo(map);

// 3. Recycling
var recycling = L.geoJson(recycling, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_recycle, title: "Recycling station" });
    },
    onEachFeature: function (feature, layer) {
        let popupContent = "";
        const recyclingOptions = ["recycling:paper", "recycling:glass", "recycling:glass_bottles", "recycling:clothes"];

        recyclingOptions.forEach(option => {
            const value = feature.properties[option];
            const label = option.replace("recycling:", "").replace("_", " "); // Entfernt 'recycling:' und ersetzt '_' durch Leerzeichen
            const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1); // Erster Buchstabe groß

            if (value === "yes") {
                popupContent += `<b>${formattedLabel}:</b> <b>Yes</b><br>`; // Fettgedrucktes Label und Wert
            } else if (value === "no") {
                popupContent += `${formattedLabel}: No<br>`; // Normales Label und Wert
            } else {
                popupContent += `${formattedLabel}: Undefined<br>`; // Normales Label und Wert
            }
        });

        layer.bindPopup(popupContent);

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function (e) {
                zoomToFeature(e);
                layer.openPopup();
            }
        });
    }
});

recycling.addTo(map);

//
//---- Part 5: Adding a layer control for base maps and feature layers
//

//the variable features lists layers that I want to control with the layer control

//the variable features lists layers that I want to control with the layer control
var groupedOverlays = {
    "Restaurants & Cafes": {
        "<img src='css/images/logo_vegerest.png' width='23' height='23'> Restaurants with vegetarian options": vegrest,
        "<img src='css/images/logo_vegrest.png' width='23' height='23'> Restaurants with vegan options": veganrest,
        "<img src='css/images/logo_vegonly.png' width='23' height='23'> Restaurants 100% meatless": vegonly,
        "<img src='css/images/logo_vegcafe.png' width='23' height='23'> Vegan cafes": vegancafe
    },
    "Shopping": {
        "<img src='css/images/logo_shopping.png' width='23' height='23'> Marketplaces": marketplace,
        "<img src='css/images/logo_shopping.png' width='23' height='23'> Organic stores": organicstore,
        "<img src='css/images/logo_secondhand.png' width='23' height='23'> Second hand stores": secondhand
    },
    "Recycling": {
        "<img src='css/images/logo_recycle1.png' width='23' height='23'> Recycling station": recycling
    }
};

var options = {
    groupCheckboxes: true,  // Checkboxen für Gruppen erlauben
    position: 'bottomright', // Position der Kontrolle
    collapsed: false        // Standardmäßig nicht eingeklappt
};

// Erstelle die grouped Layers-Control mit angepassten Optionen
var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, options);
map.addControl(layerControl);






