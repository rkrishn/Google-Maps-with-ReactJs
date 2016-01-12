var App={};
var MapComponent;
var ListComponent = React.createClass({

    getInitialState: function(){
        return { searchString: '' };
    },

    handleChange: function(e){
        this.setState({searchString:e.target.value});
    },
    itemClick: function(e){
       e.preventDefault();     
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
    var count = 1;
    var markerObj = {};
    var markerPath = 'img/markers/number_{0}.png';
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,errorCallback,
                                         {enableHighAccuracy:true, timeout:60000, maximumAge:600000});
    }
    function errorCallback(param){
    }
    function showPosition(position) {
    latitude = position.coords.latitude ;
    longitude = position.coords.longitude;
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
    icon: getMarker(count++), 
    position: place.geometry.location,
    animation: google.maps.Animation.DROP
  });

  function getMarker(num){
    var i = markerObj['m' + num];
            if (typeof i === 'undefined' || i === null) {
                i = markerObj['m' + num] = {
                    url: markerPath.replace('{0}',num)
                };
            }
            return i;
  }
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
	  <a target="_blank" href="https://github.com/rkrishn/"><img className="image" src="https://camo.githubusercontent.com/121cd7cbdc3e4855075ea8b558508b91ac463ac2/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png" /></a>
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