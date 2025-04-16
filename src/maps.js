//initialise the map and get user location
export var map = L.map('mapid').locate({
  setView: true,
  maxZoom: 6,
  layers: [defaultMap, earthquakes, wikiLinks, localWeather, nearbyPois],
})

//create base layers and add the default one to the map:
export var worldStreetMap = L.tileLayer.provider('OpenStreetMap.DE', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
export var tonerMap = L.tileLayer.provider('Stamen.Toner', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
export var defaultMap = L.tileLayer
  .provider('Esri.WorldStreetMap', {
    id: 'mapid',
    maxZoom: 18,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  })
  .addTo(map)
export var USGS_USImageryTopo = L.tileLayer.provider('USGS.USImageryTopo', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
})

//add the base maps
export var baseMaps = {
  'Default Map': defaultMap,
  'Toner Map': tonerMap,
  'World Street Map': worldStreetMap,
  'US Imagery': USGS_USImageryTopo,
}

export var overlayMaps = {
  Earthquakes: earthquakes,
  'Wikipedia Links': wikiLinks,
  'Local Weather': localWeather,
  Cafes: nearbyPois,
  Pizza: nearbyPizzaClusterGroup,
  Shops: nearbyShopsClusterGroup,
  'EV Charging Stations': evChargingStations,
  'Extra Labels': Stamen_TonerLabels,
  'Cycling Trails': WaymarkedTrails_cycling,
  'Hiking Trails': WaymarkedTrails_hiking,
}
