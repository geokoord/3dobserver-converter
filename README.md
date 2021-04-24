# observer-file-transformer

Transformation of 3-Dim Observer files to GeoJson format

```
   ____            _                       _
  / ___| ___  ___ | | _____   ___  _ __ __| |
 | |  _ / _ \/ _ \| |/ / _ \ / _ \| '__/ _` |
 | |_| |  __/ (_) |   < (_) | (_) | | | (_| |
  \____|\___|\___/|_|\_\___/ \___/|_|  \__,_|

3Dim-Observer-Data Converter | by Geokoord.com
Version: 0.0.4

Found files:
------------------------------------------------------
(0) 110-1000.3dl
(1) 110-1000.geojson
------------------------------------------------------
Select a file (by number) :
```

## Install

run the following command to install dependencies

```
npm install
```

## Run

Converts selected '.3dl' files into '\_res.geojson' files and '.geojson' files into '\_res.3dl' files.

```
node main.js
```

Example:
test.3dl --> test_res.geojson
