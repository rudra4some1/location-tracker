//initialize the socket io
const socket = io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position)=>{
      const{latitude,longitude} = position.coords;
      socket.emit("send-location", {latitude,longitude});
    },
    (error)=>{
        console.error(error);
    },
    {
    enableHighAccuracy:true,// high accuracy of location    
    timeout:5000,// update location at each 5000 ms 
    maximumAge: 0// no storage nof previous location
    }
);
}
const map = L.map("map").setView([0,0], 16);// ([cordinates, cordinates], level of zoom)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Rahul Rudra"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", () => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});