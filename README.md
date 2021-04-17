# observer-file-transformer

Transformation of 3-Dim Observer files to GeoJson format

```
   ____            _                       _
  / ___| ___  ___ | | _____   ___  _ __ __| |
 | |  _ / _ \/ _ \| |/ / _ \ / _ \| '__/ _` |
 | |_| |  __/ (_) |   < (_) | (_) | | | (_| |
  \____|\___|\___/|_|\_\___/ \___/|_|  \__,_|
3Dim-Observer/GeoJSON Converter | by Geokoord.com
Version: 0.0.2
```

## Install

run the following command to install dependencies

```
npm install
```

## 3Dim to GeoJson conversion

Converts all '.3dl' files into '\_out.geojson' files

```
node obs2geojson.js
```

Example:
test.3dl --> test_out.geojson

## GeoJson to 3Dim conversion

Converts all '.geojson' files into '\_out.3dl' files

```
node geojson2obs.js
```

Example:
test.geojson --> test_out.3dl
