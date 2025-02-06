// Using Leaflet to create an interactive web map showing sustainable ways of living and eating in Salzburg

// 1. Initialize the map with a center point and zoom level &  
//    add two base layers (CartoDB and OpenStreetMap) for users to switch between  
// 2. Include a scale bar for reference  
// 3. Define custom icons for different categories like restaurants, cafes, shopping, and recycling  
// 4. Implement interaction features: icons enlarge on hover, reset on mouseout, and zoom in on click  
// 5. Load GeoJSON data to add markers, each with a popup displaying relevant location information  
// 6. Add a grouped layer control to toggle between base layers and manage overlays  

//
//---- Part 1: adding base maps ----
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties 
//of the leaflet map object L.map.
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
	center: [47.8, 13.05],
	zoom: 15
});

// add CartoDB_Positron & Open Street Map as base layers
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
//---- Part 2: Adding a scale bar ----
//

L.control.scale({position:'bottomright',imperial:false}).addTo(map);

//
//---- Part 3: Adding Icons ---- 
//

//Determine a uniform icon size
var iconSize = [40, 40];

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
//2.1 Organic stores
var logo_shopping = L.icon({
iconUrl: 'css/images/logo_shopping.png',
iconSize: iconSize
});
//2.2 Marketplace
var logo_market = L.icon({
    iconUrl: 'css/images/logo_market.png',
    iconSize: iconSize
    });
//2.3 Second hand stores
var logo_secondhand = L.icon({
iconUrl: 'css/images/logo_secondhand.png',
iconSize: iconSize
});

//3. Recycling
var logo_recycle = L.icon({
    iconUrl: 'css/images/logo_recycle1.png',
    iconSize: iconSize
});

//
//---- Part 4: Defining functions ---- 
//

//1. Highlight features
// Enlarges the marker icon when hovered by retrieving the current icon URL 
// and replacing it with a larger version while maintaining its position.
function highlightFeature(e) {
    var layer = e.target;
    var categoryIcon = e.target.options.icon.options.iconUrl; // Retrieve dynamic icon

    layer.setIcon(
        L.icon({
            iconUrl: categoryIcon, // Same icon, but larger
            iconSize: [52, 52],
            iconAnchor: [26, 26],
            popupAnchor: [0, -26]
        })
    );
}

// 2. Reset highlights
// Resets the marker icon to its original size after hover effect is removed.
function resetHighlight(e) {
    var layer = e.target;
    var categoryIcon = e.target.options.icon.options.iconUrl; 

    layer.setIcon(
        L.icon({
            iconUrl: categoryIcon, // Back to the original
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        })
    );
}

// 3. Zoom to features
// Centers the map on the selected marker and zooms in to level 18.
function zoomToFeature(e) {
    map.setView(e.target.getLatLng(), 18);
}

//
//---- Part 5: adding point features from the geojson files ----
//

// Creates a GeoJSON layer for defined features with custom markers.
// Each marker displays a popup with specific details, formatted dynamically.
// Highlights the marker on hover, resets on mouseout, and zooms in on click.

//1.Restaurants & Cafes
//1.1 Vegetarian restaurants
var vegrest = L.geoJson(vegrest, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_vegerest, title: "Vegetarian-friendly Restaurant" });
    },
    onEachFeature: function (feature, layer) {
        // Help function for formatting the entire line (label + value)
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value; 
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties.phone) + "<br>" + "<br>" +
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" +
                        formatProperty("Indoor seating", feature.properties.indoor_seating) + "<br>" +
                        formatProperty("Outdoor seating", feature.properties.outdoor_seating));

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
        return L.marker(latlng, { icon: logo_vegrest, title: "Vegan-friendly Restaurant" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties.phone) + "<br>" + "<br>" +
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" +
                        formatProperty("Indoor seating", feature.properties.indoor_seating) + "<br>" +
                        formatProperty("Outdoor seating", feature.properties.outdoor_seating));

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
        return L.marker(latlng, { icon: logo_vegonly, title: "Meat-free Restaurant" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties.phone) + "<br>" + "<br>" +
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" +
                        formatProperty("Indoor seating", feature.properties.indoor_seating) + "<br>" +
                        formatProperty("Outdoor seating", feature.properties.outdoor_seating));

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
        return L.marker(latlng, { icon: logo_vegancafe, title: "Vegan-friendly Café" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties.phone) + "<br>" + "<br>" +
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" +
                        formatProperty("Indoor seating", feature.properties.indoor_seating) + "<br>" +
                        formatProperty("Outdoor seating", feature.properties.outdoor_seating));

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
//2.1 Organic stores
var organicstore = L.geoJson(organicstore, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_shopping, title: "Organic Store" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties.phone) + "<br>"+
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair));


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

//2.1 Marketplace
var marketplace = L.geoJson(marketplace, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_market, title: "Local Market" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
            formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
            formatProperty("Operator", feature.properties.operator) + "<br>" +
            websiteLabel + ": " + websiteDisplay + "<br>" +
            formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" );
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

//2.2 Second hand store
var secondhand = L.geoJson(secondhand, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: logo_secondhand, title: "Second-hand shop" });
    },
    onEachFeature: function (feature, layer) {
        function formatProperty(label, value) {
            // Check whether the value is “undefined”, “no” or empty and format the entire line in italics
            if (value === undefined || value === "no" || value === "") {
                return "<i>" + label + ": " + (value === undefined ? "undefined" : value) + "</i>";  // Format italics
            } else {
                return label + ": " + value;  // Normal text
            }
        }

        // Website formatting
        var websiteDisplay = feature.properties.website ? 
            "<a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>" : 
            "<i>undefined</i>";  // Standard text for “not available”

        // If the website is not defined, format the entire line in italics
        var websiteLabel = feature.properties.website === undefined ? "<i>Website</i>" : "Website"; 

        // Pop-up content with the help function for all relevant fields
        layer.bindPopup("<b>" + feature.properties.name + "</b>" + "<br>" + "<br>" +
                        formatProperty("Opening hours", feature.properties.opening_hours) + "<br>" +
                        websiteLabel + ": " + websiteDisplay + "<br>" +
                        formatProperty("Phone number", feature.properties["contact:phone"]) + "<br>" +
                        formatProperty("Wheelchair friendly", feature.properties.wheelchair) + "<br>" );

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
        return L.marker(latlng, { icon: logo_recycle, title: "Recycling Station" });
    },
    onEachFeature: function (feature, layer) {
        let popupContent = "<b>Recycling station</b><br><br>"; // Heading and paragraph
        const recyclingOptions = ["recycling:paper", "recycling:glass", "recycling:glass_bottles", "recycling:clothes"];

        recyclingOptions.forEach(option => {
            const value = feature.properties[option];
            const label = option.replace("recycling:", "").replace("_", " "); // Removes 'recycling:' and replaces '_' with spaces
            const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1); // First letter capital

            if (value === "yes") {
                popupContent += `<b>${formattedLabel}: Yes</b><br>`; // Normal text for “yes”
            } else if (value === "no") {
                popupContent += `<i>${formattedLabel}: No</i><br>`; // Italic text for “no”
            } else {
                popupContent += `<i>${formattedLabel}: Undefined</i><br>`; // Italic text for undefined values
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
//---- Part 6: Adding a grouped layer control for base maps and feature layers ----
//

// Creates a grouped layer control for different categories like restaurants, shopping, and recycling.  
// Uses custom icons in labels and automatically collapses or expands the control when resizing the window.  

var groupedOverlays = {
    "Restaurants & Cafés": {
        "<img src='css/images/logo_vegerest.png' width='23' height='23'> Vegetarian-friendly Restaurants": vegrest,
        "<img src='css/images/logo_vegrest.png' width='23' height='23'> Vegan-friendly Restaurants": veganrest,
        "<img src='css/images/logo_vegonly.png' width='23' height='23'> Meat-free Restaurants": vegonly,
        "<img src='css/images/logo_vegcafe.png' width='23' height='23'> Vegan-friendly Cafés": vegancafe
    },
    "Shopping": {
        "<img src='css/images/logo_market.png' width='23' height='23'> Local Markets": marketplace,
        "<img src='css/images/logo_shopping.png' width='23' height='23'> Organic Stores": organicstore,
        "<img src='css/images/logo_secondhand.png' width='23' height='23'> Second-hand Shops": secondhand
    },
    "Recycling": {
        "<img src='css/images/logo_recycle1.png' width='23' height='23'> Recycling Stations": recycling
    }
};

var options = {
    groupCheckboxes: true,  // Allow checkboxes for groups
    position: 'bottomright', // Control position
    collapsed: window.innerWidth <= 768 // Folded by default on small screens (cell phones)
};

// Create the grouped layers control with customized options
var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, options);
map.addControl(layerControl);

// When the window is resized, adjust the layer control
window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
        layerControl._collapse(); // Collapse Layer Control if the window is smaller than 768px
    } else {
        layerControl._expand(); // Expand Layer Control if the window is larger than 768px
    }
});




