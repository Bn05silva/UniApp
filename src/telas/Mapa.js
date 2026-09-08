import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapaScreen() {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Coordenadas da Universidade de Vassouras
        var lat = -22.4093;
        var lon = -43.6641;

        var map = L.map('map').setView([lat, lon], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Marcador principal da Universidade
        var marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<b>Universidade de Vassouras</b><br>Campus Principal").openPopup();

      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView 
        source={{ html: mapHtml }} 
        style={styles.map} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  map: { flex: 1 },
});