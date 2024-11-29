// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import Papa from 'papaparse';
// import { latLng, LatLngBounds } from 'leaflet';
// import L from 'leaflet';

// // Define interfaces for the data structure
// interface WardFeatureProperties {
//   ward_name: string;
//   green_space_need_score: number;
//   air_quality_index: number;
//   mean_land_surface_temp: number;
//   centroid: [number, number];
// }

// interface GeoJSONFeature {
//   type: 'Feature';
//   geometry: {
//     type: 'Polygon';
//     coordinates: [number, number][][];
//   };
//   properties: WardFeatureProperties;
// }

// interface GeoJSONData {
//   type: 'FeatureCollection';
//   features: GeoJSONFeature[];
// }

// // Define a custom location marker icon
// const customIcon = new L.Icon({
//   iconUrl: 'images/location.png',
//   iconSize: [25, 25],
//   iconAnchor: [12, 25],
//   popupAnchor: [0, -25],
// });

// const WardMap = () => {
//   const [wardData, setWardData] = useState<GeoJSONData | null>(null);
//   const [selectedWard, setSelectedWard] = useState<WardFeatureProperties | null>(null);
//   const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
//   const [top5Wards, setTop5Wards] = useState<WardFeatureProperties[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch('/data/aggregated_data_with_green_space_scores.csv');
//       const csvData = await response.text();
//       const geojson = csvToGeoJSON(csvData);
//       setWardData(geojson);

//       const bounds = calculateBounds(geojson);
//       setMapBounds(bounds);

//       const top5 = getTop5Wards(geojson.features);
//       setTop5Wards(top5);
//     };
//     fetchData();
//   }, []);

//   const csvToGeoJSON = (csvData: string): GeoJSONData => {
//     const parsedData = Papa.parse(csvData, {
//       header: true,
//       skipEmptyLines: true,
//     }).data as Record<string, string>[];

//     const features: GeoJSONFeature[] = parsedData.map((row) => {
//       const centroidCoords = row.ward_centroid
//         .replace('POINT (', '')
//         .replace(')', '')
//         .split(' ')
//         .map(Number) as [number, number];

//       const boundaryCoords = row.ward_boundary
//           .replace('LINESTRING (', '')
//           .replace(')', '')
//           .split(', ')
//           .map((coord) => coord.split(' ').map(Number)) as unknown as [number, number][][];

//       return {
//         type: 'Feature',
//         geometry: {
//           type: 'Polygon',
//           coordinates: boundaryCoords,
//         },
//         properties: {
//           ward_name: row.ward,
//           green_space_need_score: parseFloat(row.green_space_need_score),
//           air_quality_index: parseFloat(row.air_quality_index),
//           mean_land_surface_temp: parseFloat(row.mean_land_surface_temp),
//           centroid: centroidCoords,
//         },
//       };
//     });

//     return {
//       type: 'FeatureCollection',
//       features,
//     };
//   };

//   const calculateBounds = (geojson: GeoJSONData): LatLngBounds => {
//     const bounds = geojson.features.map((feature) =>
//       feature.geometry.coordinates[0].map(([lng, lat]) => latLng(lat, lng))
//     );

//     return new LatLngBounds([].concat(...bounds));
//   };

//   const getTop5Wards = (wards: GeoJSONFeature[]): WardFeatureProperties[] => {
//     return wards
//       .sort((a, b) => b.properties.green_space_need_score - a.properties.green_space_need_score)
//       .slice(0, 5)
//       .map((ward) => ward.properties);
//   };

//   const getColorForScore = (score: number): string => {
//     if (score >= 0.25) return '#2C6B2F';
//     if (score >= 0.20) return '#56B15C';
//     if (score >= 0.15) return '#9FD69B';
//     return '#D3D3D3';
//   };

//   const style = (feature: GeoJSONFeature) => ({
//     fillColor: getColorForScore(feature.properties.green_space_need_score),
//     weight: 1,
//     opacity: 1,
//     color: 'white',
//     dashArray: '3',
//     fillOpacity: 0.6,
//   });

//   const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
//     layer.on('click', () => setSelectedWard(feature.properties));
//   };

//   return (
//     <div className="relative h-screen flex">
//       <div className="w-64 bg-white shadow-lg p-4">
//         <h3 className="text-lg font-bold">Top 5 Wards with Green Space Need</h3>
//         <ul className="mt-4">
//           {top5Wards.map((ward, index) => (
//             <li key={index} className="mb-2">
//               <strong>{ward.ward_name}</strong>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="flex-1">
//         <MapContainer
//           center={[1.286389, 36.817223]}
//           zoom={12}
//           className="h-full w-full"
//           bounds={mapBounds || undefined}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="&copy; OpenStreetMap contributors"
//           />
//           {wardData && (
//             <GeoJSON
//               data={wardData}
//               style={style}
//               onEachFeature={onEachFeature}
//             />
//           )}
//         </MapContainer>
//       </div>
//       {selectedWard && (
//         <div className="absolute bottom-0 left-0 bg-white p-4 w-full shadow-lg">
//           <h3 className="font-bold">{selectedWard.ward_name}</h3>
//           <p><strong>Green Space Need Score:</strong> {selectedWard.green_space_need_score}</p>
//           <p><strong>Air Quality Index:</strong> {selectedWard.air_quality_index}</p>
//           <p><strong>Land Surface Temperature:</strong> {selectedWard.mean_land_surface_temp} °C</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WardMap;
