const express = require('express');
const app = express();

app.get("/app", (req,res) => {
    res.send("home")
});

//surfing locations
const SURF_SPOTS = {
  pipeline:       { name: 'Pipeline',           country: 'Hawaii, USA',      lat: 21.66,  lon: -158.05 },
  jeffreysbay:    { name: "Jeffrey's Bay",       country: 'South Africa',     lat: -34.05, lon: 24.93   },
  uluwatu:        { name: 'Uluwatu',             country: 'Bali, Indonesia',  lat: -8.82,  lon: 115.08  },
  hossegor:       { name: 'Hossegor',            country: 'France',           lat: 43.67,  lon: -1.43   },
  snapper:        { name: 'Snapper Rocks',       country: 'Australia',        lat: -28.16, lon: 153.55  },
  mundaka:        { name: 'Mundaka',             country: 'Spain',            lat: 43.41,  lon: -2.70   },
  teahupoo:       { name: "Teahupo'o",           country: 'Tahiti',           lat: -17.85, lon: -149.25 },
  cloudbreak:     { name: 'Cloudbreak',          country: 'Fiji',             lat: -17.98, lon: 177.33  },
  supertubes:     { name: 'Supertubes',          country: 'South Africa',     lat: -34.05, lon: 24.92   },
  bondi:          { name: 'Bondi Beach',         country: 'Australia',        lat: -33.89, lon: 151.27  },
  nazare:         { name: 'Nazaré',              country: 'Portugal',         lat: 39.60,  lon: -9.07   },
  trestles:       { name: 'Trestles',            country: 'California, USA',  lat: 33.38,  lon: -117.59 },
  huntington:     { name: 'Huntington Beach',    country: 'California, USA',  lat: 33.65,  lon: -118.00 },
  raglan:         { name: 'Raglan',              country: 'New Zealand',      lat: -37.80, lon: 174.87  },
  bells:          { name: 'Bells Beach',         country: 'Australia',        lat: -38.37, lon: 144.28  },
};

app.post("/api/conditions",  async (req, res) => {
  const {spot, activity, days} = req.body
  
  if (!spot || !activity || !days) {
    return res.status(400).json({errro: "Invalid input. Must input spot, activity and days"});
  }
  
  console.log("post request");
});

app.listen(3000);

