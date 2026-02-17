// maptilersdk.config.apiKey = MAP_TOKEN;

// // 2️⃣ Create map AFTER page loads
// document.addEventListener("DOMContentLoaded", function () {
//   const map = new maptilersdk.Map({
//     container: "map",
//     style: maptilersdk.MapStyle.TOPO,
//     center: [16.62662018, 49.2125578],
//     zoom: 9,
//   });
// });


// new maptilersdk.Marker()
//     .setLngLat(coordinates)
//     .addTo(map);


maptilersdk.config.apiKey = MAP_TOKEN;

document.addEventListener("DOMContentLoaded", function () {

  const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 9,
  });

  new maptilersdk.Marker()
    .setLngLat(coordinates)
    .addTo(map);

});

