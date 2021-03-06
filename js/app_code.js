"use strict";

/**
 * Helper function. Checks if obj is undefined and returns a string (or Not found, if nothing is passed).
 * This function is used in the Foursquare data retrieval to check for missing bits.
 */
var isUndefined = function (obj, ifUndefined) {
    ifUndefined = typeof ifUndefined !== 'undefined' ? ifUndefined : "Not found";
    if (obj === undefined) {
        return ifUndefined;
    } else {
        return obj;
    }
};

/**
 * This is a constructor function (prototype) to create new markers on the map
 * Inspiration comes from http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
 */
var GoogleMapsMarker = function (map, obj) {

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
 * This is a constructor function (prototype) to create the main knockoutJS object.
 * It creates the knockoutJS objects for each element of a location, including the API call for foursquare (address fetch)
 * Note: observables are used only for objects that *change*!
 */
var Location = function (obj) {

    var that = this;

    this.id = obj.id;
    this.name = ko.observable(obj.name);
    this.longText = obj.longText;
    this.link = obj.link;
    this.long = obj.long;
    this.lat = obj.lat;
    this.modalId = ko.observable("modal" + obj.id);
    this.modalIdLink = ko.observable("#modal" + obj.id);
    this.marker = ko.observable(new GoogleMapsMarker(map, obj)); // Calls the GoogleMapsMarker prototype

    this.visible = ko.observable(true); // Is used to toggle visibility of the object
    // Function looks for changes in the visible property and sets marker visibility accordingly
    this.visible.subscribe(function (state) {
        if (state) {
            that.marker().visible(true);
        } else {
            that.marker().visible(false);
        }
    });

    this.jsonOK = ko.observable(false);

    // If fs venue id is in the location data, fetch the address information from the Foursquare API using asynchronous AJAX request
    if (obj.fs) {
        this.fsName = ko.observable();
        this.fsAddress = ko.observable();
        this.fsPhone = ko.observable();
        this.fsCity = ko.observable();

        var jsonURL = 'https://api.foursquare.com/v2/venues/' + obj.fs +
            '?client_id=B1WZZ24MMR5FJTWHYSBUTJ1A0U2GPTNUUI21SRAQ4E4OZKY5' +
            '&client_secret=3LDU3KLUCVTNSOAONSKSGYGRJ5VIMQN2ZV1M1S13AJFETM4K&v=20130815';

        $.getJSON(jsonURL)
            .done(function (json) {
                that.fsName(isUndefined(json.response.venue.name));
                that.fsAddress(isUndefined(json.response.venue.location.address));
                that.fsPhone(isUndefined(json.response.venue.contact.formattedPhone));
                that.fsCity(isUndefined(json.response.venue.location.postalCode, "") + " " + isUndefined(json.response.venue.location.city));
                that.jsonOK(true);
            })
            .fail(function (d) {
                console.log("$.getJSON failed for id: " + obj.id); // returns the id of the failed object
                that.jsonOK(false); // sets jsonOK to false : not showing the address information.
            });
    }
};

/**
 * This is the main ViewModel function
 */
var viewModel = function () {

    var that = this;

    /**
     * For each locations (./data/locations.js), push an object of type Location in the observableArray
     * This creates the main array with all data used in the view.
     */
    this.locationList = ko.observableArray();
    locations.forEach(function (obj) {
        that.locationList.push(new Location(obj));
    });

    /**
     * Function looks for changes in the filtering dialog,
     * and applies the correct filter to list and markers (and toggles visibility accordingly)
     */
    this.filterList = ko.observable();
    this.filterList.subscribe(function (val) {
        var re = new RegExp(val, 'i');
        that.locationList().forEach(function (obj) {
            if (!obj.name().match(re)) {
                obj.visible(false);
            } else {
                obj.visible(true);
            }
        });
    });

    /**
     * Function is called when an element in the list is clicked. It bounces and opens the modal.
     */
    this.clickedElem = ko.observable();
    this.listClicked = function (obj) {
        that.clickedElem(obj);
        $(that.clickedElem().modalIdLink()).openModal();
        obj.marker().gmm.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            obj.marker().gmm.setAnimation(null);
        }, 750);
    };

    /**
     * Function is called when an element in the list is hovered. The corresponding marker bounces.
     * And it stops when the element in the list is unhovered.
     */
    this.focusedMarker = ko.observable();
    this.focused = function (obj) {
        that.focusedMarker(obj);
        obj.marker().gmm.setAnimation(google.maps.Animation.BOUNCE);
    };
    this.unfocused = function (obj) {
        obj.marker().gmm.setAnimation(null);
    };

    /**
     * The following functions open and close the list view on a smartphone
     */
    this.openNavigation = function () {
        $("#side-nav").show();
    };

    this.closeNavigation = function () {
        $("#side-nav").hide();
    };
};

/**
 *  Initialize Google map. Set initial settings. And fire KnockoutJS ViewModel when Google Map is loaded.
 */
var map;
var initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.10888, lng: 6.82964},
        zoom: 15
    });

    // This is here for a reason: Google Maps is loaded asynchronously and we have to make sure it's fully loaded before we go on
    ko.applyBindings(new viewModel());
};

/**
 * Function called when there is an error loading Google Maps API. It triggers an alert.
 */
var googleError = function () {
    alert("Google map did not load. This app won't work without it");
};
