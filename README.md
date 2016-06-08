# My Neighborhood Map
## Udacity FEND project 5
## Readme

The App is available at http://fabienfivaz.ch/frontend-nanodegree-neighborhood-map/.

### Introduction
The aim of this project is to build a neighborhood map with the locations of at least five interesting places. The app must be single page and the locations must be shown as markers on the map and items in a list. The app must be responsive and working on computers, laptops and smartphones.

We chose our home town of La Chaux-de-Fonds, Switzerland and a bunch of tourist attractions and commodities: zoo, station, tourist office, hospital, etc. Each location has a at least a name, some text (created using the [Lipsum generator](http://fr.lipsum.com/)), coordinates, a link to an external website and, if available, an entry in the Foursquare database.

### Libraries
 - We used [Materialize](http://materializecss.com/) as the framework around which the app is created. We used it for it's simplicity, nice layout and object graphics.
 - We used [KnockoutJS](http://knockoutjs.com/) as the *Model-View-ViewModel* implementation framework.
 - [jQuery](https://jquery.com/) is a dependency for KnockoutJS and Materialize.
 
All data, views and interactions are handled using the KnockoutJS framework. The only exceptions are the Materialize modals and the buttons for opening and closing the list view when using the app on a smartphone, called using jQuery
  
### APIs
 - We used the [Foursquare API](http://api.foursquare.com/) for extracting addresses for our locations.
 - We used the [Google Maps API](https://developers.google.com/maps) for the map
 
 The Foursquare API is called asynchronously using  ```$.getJSON```. Errors are handled using a console message with failing id and removing the address block from the layout (same as if there was no Foursquare venue ID in the data). Data is handled by Knockout.