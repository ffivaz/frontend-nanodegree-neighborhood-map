"use strict";

var markers = [];


var locations = [
    {
        id: 1,
        name: 'Parc de l\'abeille',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Park',
        link: null,
        lat: 47.10888,
        long: 6.82964
    },
    {
        id: 2,
        name: 'Bois du Petit Château',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Recreation',
        link: 'http://www.chaux-de-fonds.ch/musees/zoo',
        lat: 47.10576,
        long: 6.82214
    },
    {
        id: 3,
        name: 'Stade de la Charrière',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Sport',
        link: null,
        lat: 47.11075,
        long: 6.83664
    },
    {
        id: 4,
        name: 'Boulangerie du carrefour',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Shopping',
        link: null,
        lat: 47.11009,
        long: 6.82944
    },
    {
        id: 5,
        name: 'Hôpital de La Chaux-de-Fonds',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Service',
        link: null,
        lat: 47.11323,
        long: 6.83179
    },
    {
        id: 6,
        name: 'Poste de la Charrière',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum molestie placerat. Maecenas venenatis libero eget tellus vehicula, vel feugiat purus vestibulum. Curabitur vitae sagittis risus. Curabitur urna ipsum, pharetra vel lectus at, tristique condimentum lacus. In vitae dolor at mauris mollis ullamcorper sed ac purus. Phasellus orci dui, convallis et neque quis, suscipit fringilla tortor. Cras faucibus magna eu libero rutrum, eget interdum lacus efficitur.',
        type: 'Service',
        link: null,
        lat: 47.10835,
        long: 6.83159
    }
];

var Location = function(obj) {
    var self = this;
    this.id = ko.observable(obj.id);
    this.name = ko.observable(obj.name);
    this.longText = ko.observable(obj.longText);
    this.type = ko.observable(obj.type);
    this.long = ko.observable(obj.long);
    this.lat = ko.observable(obj.lat);
    this.modalId = ko.observable("modal" + obj.id);
    this.modalIdLink = ko.observable("#modal" + obj.id);
};

var viewModel = function() {

    var self = this;

    self.locationList = ko.observableArray([]);

    locations.forEach(function(obj) {
       self.locationList.push( new Location(obj) );
    });

    self.clickedMarker = ko.observable();

    self.clicked = function (obj) {
        self.clickedMarker(obj);
        $(self.clickedMarker().modalIdLink()).openModal();
        this._mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        var that = this;
        setTimeout(function () {
            that._mapMarker.setAnimation(null);
        }, 750);
    };

    self.focusedMarker = ko.observable();

    self.focused = function (obj) {
        self.focusedMarker(obj);
        this._mapMarker.setAnimation(google.maps.Animation.BOUNCE)
    };

    self.unfocused = function (obj) {
        this._mapMarker.setAnimation(null);
    };
};

/* Many people point out to a custom binding to manage the interaction between Google Maps and KnockOutJS.
 * Here is the one link : http://www.codeproject.com/Articles/387626/BikeInCity-2-KnockoutJS-JQuery-Google-Maps
 * Here it the code... */

ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
        var marker = new google.maps.Marker({
            id: allBindingsAccessor().id,
            map: allBindingsAccessor().map,
            position: position,
            title: allBindingsAccessor().name()
        });

        google.maps.event.addListener(marker, 'click', function () {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            $(allBindingsAccessor().md()).openModal();
            setTimeout(function () {
                marker.setAnimation(null);
            }, 750);
        });

        markers.push(marker);
        viewModel._mapMarker = marker;
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var latlng = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
        viewModel._mapMarker.setPosition(latlng);

        var value = valueAccessor();
        if (ko.unwrap(value)) {
            element.focus();
        }
    }
};

ko.applyBindings(new viewModel());
