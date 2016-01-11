var App={};
var MapComponent;
var ListComponent = React.createClass({

    getInitialState: function(){
        return { searchString: '' };
    },

    handleChange: function(e){

        // If you comment out this line, the text box will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.searchString.

        this.setState({searchString:e.target.value});
    },
itemClick: function(e){
       e.preventDefault();
      //this.refs['mapInfo'].setSearchKey(e.target.text);       
      MapComponent.prototype.setSearchKey(e.target.text);    
    },
    render: function() {

        var libraries = this.props.data,
            searchString = this.state.searchString.trim().toLowerCase();


        if(searchString.length > 0){

            // We are searching. Filter the results.

            libraries = libraries.filter(function(l){
                return l.title.toLowerCase().match( searchString );
            });

        }
        var listItems = libraries.map((function(l){
                            return (<li key={l.url} ><a href={l.url} onClick={this.itemClick}>{l.title}</a></li>)
                        }).bind(this));


        return <div className="listCls">
                    Filter By       <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Search..." />

                    <ul> 

                        {listItems}

                    </ul>

                </div>;

    },

});

/*var InterMedComponent= React.createClass({
 render: function() {
  return(
        <div>
        <MapComponent />
        <SearchExample />
        </div>
  );
},*/

MapComponent= React.createClass({
 render: function() {
  return(
  <div id="map" className="mapCls"></div>
  );
},
componentDidMount: function() {
   this.setSearchKey("Atm");    
  },
setSearchKey: function(value){
    this.drawMap(value);
    document.getElementById("heading").innerText= value +" Near you...!";
  },
  drawMap: function(value){
    var map;
    var infowindow;
    var latitude;
    var longitude;
    var markers = [];
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position) {
    latitude = position.coords.latitude ;
    longitude = position.coords.longitude;

    $.get("http://ipinfo.io", function (response) {
    alert(response.city);
      }, "jsonp");


    /*codeLatLng(latitude, longitude);

     function codeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
     geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        var result = results[0];
        var state = '';

        for (var i = 0, len = result.address_components.length; i < len; i++) {
            var ac = result.address_components[i];

            if (ac.types.indexOf('administrative_area_level_1') >= 0) {
                state = ac.short_name;
            }
        }

        alert(state);

    });
  }*/
    var pyrmont = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15,
    scrollwheel: true
  });

  var request = {
    location: pyrmont,
    radius: '5500',
    query: value
  };
  console.log(value);
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.close();
    infowindow.setContent(place.name+"...!"+place.formatted_address);
    infowindow.open(map, this);
  });
}
    }
  },
});
var libraries;
var GoogleMap = React.createClass({
  loadPlacesFromServer: function() {
    $.ajax({
      url: "../data/places.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setState({data: data.data});
        libraries = data.data;
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
   this.loadPlacesFromServer();    
  },
  
  render: function() {

    return (
      <div className="googleMap">   
        <h1 id="heading"></h1>          
        <div className="Box">  
        <ListComponent data={this.state.data} ref="mapInfo"/>             
        <MapComponent />          
        </div>
      </div>
    );
  },
 
});
var NavBar = React.createClass({
  render: function(){
    var self = this;
      return (    
            <div className="navBarCls">            
             <input type="text" id="pac-input" name="zip" placeholder="Enter your zip code" className="input-medium search-query"/>                       
            </div>
     );
  },
   handleThatEvent: function(e){
    var oZipCode = document.getElementsByTagName("input")[0].value;
    alert(oZipCode);
    }

});
ReactDOM.render(   
     <GoogleMap />,
    document.getElementById('content')
);