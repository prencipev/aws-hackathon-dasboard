mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlbnpvIiwiYSI6ImNqMTI1NDEwdDA0eXIycXNkcHg2ZmYzYnQifQ.mM8giG7rXCqeYVmbPm3JUg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/khenzo/cj12acfpf00842rquh6dbtnu2',
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
    // We use D3 to fetch the JSON here so that we can parse and use it separately
    // from GL JS's use in the added source. You can use any request method (library
    // or otherwise) that you want.
    d3.json('hike.geojson', function(err, data) {
        if (err) throw err;

        // save full coordinate list for later
        var coordinates = data.features[0].geometry.coordinates;

        // start by showing just the first coordinate
        data.features[0].geometry.coordinates = [coordinates[0]];

        // add it to the map
        map.addSource('trace', { type: 'geojson', data: data });
        map.addLayer({
            "id": "trace",
            "type": "line",
            "source": "trace",
            "paint": {
                "line-color": "yellow",
                "line-opacity": 0.75,
                "line-width": 5
            }
        });

        // setup the viewport
        map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
        map.setPitch(30);

        // on a regular basis, add more coordinates from the saved list and update the map
        var i = 0;
        var timer = window.setInterval(function() {
            if (i < coordinates.length) {
                data.features[0].geometry.coordinates.push(coordinates[i]);
                map.getSource('trace').setData(data);
                map.panTo(coordinates[i]);
                i++;
            } else {
                window.clearInterval(timer);
            }
        }, 1000);
    });
});

var pubnub = new PubNub({
  publishKey: 'pub-c-70966b5d-fa5f-41fe-990a-aa9bae9611f6',
  subscribeKey: 'sub-c-3084f536-1873-11e7-a5a9-0619f8945a4f'
});
eon.chart({
  pubnub: pubnub,
  channels: ['eon-gauge'],
  generate: {
    bindto: '#chart',
    data: {
      type: 'gauge',
    },
    gauge: {
      min: 0,
      max: 100
    },
    color: {
      pattern: ['#c9c3c3', '#666', '#1e2026', '#232020', '#000'],
      threshold: {
        values: [30, 60, 90]
      }
    }
  }
});

setInterval(function(){

  pubnub.publish({
    channel: 'eon-gauge',
    message: {
      eon: {
        'data': Math.random() * 99
      }
    }
  })

}, 1000);

eon.chart({
  channels: ['eon-spline'],
  history: true,
  flow: true,
  pubnub: pubnub,
  generate: {
    bindto: '#chart-spine',
    data: {
      labels: false
    },
grid: {
        y: {
            lines: [
                {value: 40, text: 'High', position: 'start', color:'red'},
                {value: 10, text: 'Low', position: 'start'}
            ]
        }
    },
    color: {
        pattern: ['red']
    }
  }
});

setInterval(function(){

  pubnub.publish({
    channel: 'eon-spline',
    message: {
      eon: {
        'Temperature': Math.floor(Math.random() * 39),

      }
    }
  });

}, 1000);