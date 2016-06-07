"use strict";

/**
 * This is a constructor function (prototype) to create new markers on the map
 * Inspiration comes from http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
 */
var googleMarkers = function (map, obj) {

    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(obj.lat, obj.long),
        title: obj.name
    });

    google.maps.event.addListener(marker, 'click', function () {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        $("#modal" + obj.id).openModal();
        setTimeout(function () {
            marker.setAnimation(null);
        }, 750);
    });

    this.gmm = marker; // exposes the marker (used to set animations when focusing or clicking on a link or on the marker)

    this.visible = ko.observable(true); // exposes the visible property
    // Function looks for changes in the visible property and sets marker visibility accordingly
    this.visible.subscribe(function (state) {
        if (state) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
};

/**
 * This is a constructor function (prototype) to create the main knockoutJS object
 */
var Location = function (obj) {
    this.id = ko.observable(obj.id);
    this.name = ko.observable(obj.name);
    this.longText = ko.observable(obj.longText);
    this.type = ko.observable(obj.type);
    this.long = ko.observable(obj.long);
    this.lat = ko.observable(obj.lat);
    this.modalId = ko.observable("modal" + obj.id); // used to link
    this.modalIdLink = ko.observable("#modal" + obj.id);
    this.marker = ko.observable(new googleMarkers(map, obj)); // Calls the googleMarker prototype

    var that = this;
    this.visible = ko.observable(true); // Is used to toggle visibility of the object
    // Function looks for changes in the visible property and sets marker visibility accordingly
    this.visible.subscribe(function (state) {
        if (state) {
            that.marker().visible(true);
        } else {
            that.marker().visible(false);
        }
    });
};

/**
 * This is the main ViewModel function
 */
var viewModel = function () {

    var self = this;

    self.locationList = ko.observableArray(); // this is the list of locations used for lists
    // For each locations (./data/locations.js), push an object of type Location in the observableArray
    locations.forEach(function (obj) {
        self.locationList.push(new Location(obj)); // Because of the Location function, this automagically creates the markers on the map.
    });

    self.filterList = ko.observable(); // This is the text that the user types into the filtering dialog
    // the following function looks for changes in the filtering dialog, and applies the correct filter to list and markers (and toggles visibility accordingly)
    self.filterList.subscribe(function (val) {
        var re = new RegExp(val, 'i');

        self.locationList().forEach(function (obj) {
            if (!obj.name().match(re)) {
                obj.visible(false);
            } else {
                obj.visible(true);
            }
        });
    });

    self.clickedMarker = ko.observable();

    self.clicked = function (obj) {
        self.clickedMarker(obj);
        $(self.clickedMarker().modalIdLink()).openModal();
        obj.marker().gmm.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            obj.marker().gmm.setAnimation(null);
        }, 750);
    };

    self.focusedMarker = ko.observable();
    self.focused = function (obj) {
        self.focusedMarker(obj);
        obj.marker().gmm.setAnimation(google.maps.Animation.BOUNCE)
    };
    self.unfocused = function (obj) {
        obj.marker().gmm.setAnimation(null);
    };
};

ko.applyBindings(new viewModel());

$("#side-nav").hide();

/* Set the width of the side navigation to 250px */
function openNav() {
    $("#side-nav").show();
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#side-nav").hide();
}


