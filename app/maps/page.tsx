// 'use client'
// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import Papa from 'papaparse';
// import { latLng, LatLngBounds } from 'leaflet';
// import L from 'leaflet';

// // Define a custom location marker icon
// const customIcon = new L.Icon({
//   iconUrl: 'images/location.png', // Path to your custom icon image
//   iconSize: [25, 25], // Size of the icon
//   iconAnchor: [12, 25], // Position of the anchor (for correct placement of the icon)
//   popupAnchor: [0, -25], // Position of the popup relative to the icon
// });
// const WardMap = () => {
//   const [wardData, setWardData] = useState<any>(null);
//   const [selectedWard, setSelectedWard] = useState<any | null>(null);
//   const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
//   const [top5Wards, setTop5Wards] = useState<any[]>([]);
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // Fetch the CSV data
//       const fetchData = async () => {
//         const response = await fetch('/data/aggregated_data_with_green_space_scores.csv');
//         const csvData = await response.text();
//         const geojson = csvToGeoJSON(csvData);
//         setWardData(geojson);
//         // Calculate bounds for the wards
//         const bounds = calculateBounds(geojson);
//         setMapBounds(bounds);
//         // Filter and sort to get the top 5 wards with the highest green space need score
//         const top5 = getTop5Wards(geojson.features);
//         setTop5Wards(top5);
//       };
//       fetchData();
//     }
//   }, []);
//   // Convert CSV to GeoJSON
//   const csvToGeoJSON = (csvData: string) => {
//     const parsedData = Papa.parse(csvData, {
//       header: true,
//       skipEmptyLines: true,
//     });
//     const features = parsedData.data.map((row: any) => {
//       const centroid = row.ward_centroid; // "POINT (longitude latitude)"
//       const boundary = row.ward_boundary; // "LINESTRING (longitude latitude, longitude latitude, ...)"
//       const centroidCoords = centroid.replace('POINT (', '').replace(')', '').split(' ').map(Number);
//       const boundaryCoords = boundary.replace('LINESTRING (', '').replace(')', '').split(', ').map((coord: string) => coord.split(' ').map(Number));
//       // Validate coordinates
//       if (isNaN(centroidCoords[0]) || isNaN(centroidCoords[1])) {
//         console.error(Invalid centroid coordinates for ward: ${row.ward});
//         return null;
//       }
//       return {
//         type: "Feature",
//         geometry: {
//           type: "Polygon", // Convert LINESTRING to Polygon
//           coordinates: [boundaryCoords], // The boundaries will be used for drawing a polygon
//         },
//         properties: {
//           ward_name: row.ward,
//           green_space_need_score: parseFloat(row.green_space_need_score),
//           air_quality_index: parseFloat(row.air_quality_index),
//           mean_land_surface_temp: parseFloat(row.mean_land_surface_temp),
//           centroid: centroidCoords, // Store centroid coordinates for markers
//         },
//       };
//     }).filter((feature: any) => feature !== null);
//     return {
//       type: "FeatureCollection",
//       features: features,
//     };
//   };
//   // Function to calculate the bounds of the area of interest (ward boundaries)
//   const calculateBounds = (geojson: any) => {
//     const bounds = geojson.features.map((feature: any) => {
//       const coordinates = feature.geometry.coordinates[0]; // Assuming Polygon with [lat, lng] pairs
//       return coordinates.map((coord: [number, number]) => latLng(coord[1], coord[0]));
//     });
//     // Use the bounds to fit the map
//     return new LatLngBounds([].concat(...bounds)); // Flatten and create a LatLngBounds
//   };
//   // Filter and sort the wards to get the top 5 with the highest green space need score
//   const getTop5Wards = (wards: any[]) => {
//     // Sort the wards based on green space need score in descending order
//     const sortedWards = wards.sort((a, b) => b.properties.green_space_need_score - a.properties.green_space_need_score);
//     // Return the top 5 wards with only the name
//     return sortedWards.slice(0, 5).map((ward: any) => ({
//       name: ward.properties.ward_name,
//     }));
//   };
//   // Function to determine color based on the green space need score
//   const getColorForScore = (score: number) => {
//     if (score >= 0.20) return '#2C6B2F'; // Dark Green (Very Low Green Space Need)
//     if (score >= 0.23) return '#56B15C'; // Green (Low Green Space Need)
//     if (score >= 0.25) return '#9FD69B'; // Light Green (Medium Green Space Need)
//     return '#D3D3D3'; // Light Grey (High Green Space Need)
//   };
//   // Styling function for GeoJSON layer
//   const style = (feature: any) => {
//     return {
//       fillColor: getColorForScore(feature.properties.green_space_need_score),
//       weight: 1,
//       opacity: 1,
//       color: 'white',
//       dashArray: '3',
//       fillOpacity: 0.6,
//     };
//   };
//   // Handling ward click
//   const onWardClick = (ward: any) => {
//     const properties = ward.target.feature.properties;
//     setSelectedWard({
//       name: properties.ward_name,
//       greenSpaceNeedScore: properties.green_space_need_score,
//       airQualityIndex: properties.air_quality_index,
//       meanLandSurfaceTemp: properties.mean_land_surface_temp,
//     });
//   };
//   return (
//     <div className="relative h-screen flex">
//       {/* Sidebar for Top 5 Wards */}
//       <div className="w-64 bg-white shadow-lg p-4">
//         <h3 className="text-lg font-bold">Top 5 Wards with Green Space Need</h3>
//         <ul className="mt-4">
//           {top5Wards.map((ward, index) => (
//             <li key={index} className="mb-2">
//               <strong>{ward.name}</strong>
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Map Section */}
//       <div className="flex-1">
//         <MapContainer
//           center={[1.286389, 36.817223]}
//           zoom={12}
//           className="h-full w-full"
//           bounds={mapBounds} // Set the bounds of the map
//           whenCreated={(map) => {
//             if (mapBounds) {
//               map.fitBounds(mapBounds);
//             }
//           }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="&copy; OpenStreetMap contributors"
//           />
//           {/* Render GeoJSON Features (Ward Boundaries) */}
//           {wardData && (
//             <GeoJSON
//               data={wardData}
//               style={style} // Apply dynamic styling
//               onEachFeature={(feature: any, layer: any) => {
//                 layer.on("click", (event: any) => onWardClick(event));
//               }}
//             />
//           )}
//           {/* Render Centroids as Custom Location Markers */}
//           {wardData && wardData.features.map((feature: any, index: number) => {
//             const centroidCoords = feature.properties.centroid as number[];
//             return (
//               <Marker
//                 key={index}
//                 position={latLng(centroidCoords[1], centroidCoords[0])}
//                 icon={customIcon}
//               >
//                 <Popup>
//                   <div>
//                     <h3>{feature.properties.ward_name}</h3>
//                     <p><strong>Green Space Need Score:</strong> {feature.properties.green_space_need_score}</p>
//                     <p><strong>Air Quality Index:</strong> {feature.properties.air_quality_index}</p>
//                     <p><strong>Land Surface Temperature:</strong> {feature.properties.mean_land_surface_temp} °C</p>
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MapContainer>
//       </div>
//       {selectedWard && (
//         <div className="absolute bottom-0 left-0 bg-white p-4 w-full shadow-lg">
//           <h3 className="font-bold">{selectedWard.name}</h3>
//           <p><strong>Green Space Need Score:</strong> {selectedWard.greenSpaceNeedScore}</p>
//           <p><strong>Air Quality Index:</strong> {selectedWard.airQualityIndex}</p>
//           <p><strong>Land Surface Temperature:</strong> {selectedWard.meanLandSurfaceTemp} °C</p>
//         </div>
//       )}
//     </div>
//   );
// };
// export default WardMap; 