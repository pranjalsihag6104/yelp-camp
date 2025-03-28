document.addEventListener("DOMContentLoaded", function () {
  if (!campground || !campground.geometry || !campground.geometry.coordinates) {
      console.error("No coordinates found for campground");
      return;
  }

  maptilersdk.config.apiKey = maptilerApiKey;

  const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.BRIGHT,
      center: campground.geometry.coordinates, // [lng, lat]
      zoom: 10
  });

  new maptilersdk.Marker()
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
          new maptilersdk.Popup({ offset: 25 })
              .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
      )
      .addTo(map);
});
