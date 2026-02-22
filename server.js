const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/app", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

  const location = SURF_SPOTS[spot];
  const lat = location.lat;
  const lon = location.lon;
  const name = location.name;
  const country = location.country;

  const today = new Date();
  const start = today.toISOString().split('T')[0];
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (parseInt(days) - 1));
  const end = endDate.toISOString().split('T')[0];



  try {
    const [marineRes, weatherRes] = await Promise.all([
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max,wave_period_max,swell_wave_height_max&timezone=auto&start_date=${start}&end_date=${end}`),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&start_date=${start}&end_date=${end}`)
    ])

    const marineData = await marineRes.json();
    const weatherData = await weatherRes.json();
    
    if (marineData.error)
      return res.status(500).json({error:marineData.reason});
    if (weatherData.error) 
      return res.status(500).json({error:weatherData.reason});
    
    const forecast = marineData.daily.time.map((date, i) => {
      const wave = marineData.daily.wave_height_max[i] ?? 0;
      const swell = marineData.daily.wave_period_max[i] ?? 0;
      const swellH = marineData.daily.swell_wave_height_max[i] ?? 0;
      const wind = weatherData.daily.windspeed_10m_max[i] ?? 0;
      const windDir = weatherData.daily.winddirection_10m_dominant[i] ?? 0;
      const tempMax = weatherData.daily.temperature_2m_max[i] ?? 0;
      const tempMin = weatherData.daily.temperature_2m_min[i] ?? 0;
      const precip = weatherData.daily.precipitation_sum[i] ?? 0;

      return {date, wave, swell, swellH, wind, windDir, tempMax, tempMin, precip};
    });

    res.json({spot: name, country, activity, forecast});
    
    } catch {
      console.error(err);
      res.status(500).json({error: 'Server error: ' + err.message});
    }
})

app.listen(3000);

