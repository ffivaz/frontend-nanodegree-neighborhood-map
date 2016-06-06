"use strict";

var markers = [];


var locations = [
    {
        id: 1,
        name: 'Parc de l\'abeille',
        type: 'Park',
        link: null,
        lat: 47.10888,
        long: 6.82964,
        highlighted: false
    },
    {
        id: 2,
        name: 'Bois du Petit Château',
        type: 'Recreation',
        link: 'http://www.chaux-de-fonds.ch/musees/zoo',
        lat: 47.10576,
        long: 6.82214,
        highlighted: false
    },
    {
        id: 3,
        name: 'Stade de la Charrière',
        type: 'Sport',
        link: null,
        lat: 47.11075,
        long: 6.83664,
        highlighted: false
    },
    {
        id: 4,
        name: 'Boulangerie du carrefour',
        type: 'Shopping',
        link: null,
        lat: 47.11009,
        long: 6.82944,
        highlighted: false
    },
    {
        id: 5,
        name: 'Hôpital de La Chaux-de-Fonds',
        type: 'Service',
        link: null,
        lat: 47.11323,
        long: 6.83179,
        highlighted: false
    },
    {
        id: 6,
        name: 'Poste de la Charrière',
        type: 'Service',
        link: null,
        lat: 47.10835,
        long: 6.83159,
        highlighted: false
    }
];

var Location = function(obj) {
    this.id = ko.observable(obj.id);
    this.name = ko.observable(obj.name);
    this.type = ko.observable(obj.type);
    this.long = ko.observable(obj.long);
    this.lat = ko.observable(obj.lat);
    this.highlighted = ko.observable(obj.highlighted);
};

var viewModel = function() {

    var self = this;

    this.locationList = ko.observableArray([]);

    locations.forEach(function(obj) {
       self.locationList.push( new Location(obj) );
    });

    this.currentMarker = ko.observable( this.locationList()[0] );

    self.highlighted = function (obj) {
        self.currentMarker(obj);
    };

};

/* Many people point out to a custom binding to manage the interaction between Google Maps and KnockOutJS.
 * Here is the link : http://www.codeproject.com/Articles/387626/BikeInCity-2-KnockoutJS-JQuery-Google-Maps
 * Here it the code... */

ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
        var marker = new google.maps.Marker({
            map: allBindingsAccessor().map,
            position: position,
            title: allBindingsAccessor().name()
        });

        google.maps.event.addListener(marker, 'click', function () {
            /* Here comes the code when the marker is clicked */
        });

        markers.push(marker);
        viewModel._mapMarker = marker;
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        /*var latlng = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
        viewModel._mapMarker.setPosition(latlng);*/

        var value = valueAccessor();
        if (ko.unwrap(value))
            element.focus();
        else
            element.blur();

    }
};

ko.applyBindings(new viewModel());
