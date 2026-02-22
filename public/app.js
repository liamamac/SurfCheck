const form = document.getElementById('conditionsForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const spot = document.getElementById('spot').value;
    const activity = document.querySelector('input[name="activity"]:checked').value;
    const days = document.getElementById('days').value;

    console.log('Form values:', { spot, activity, days }); 

    const res = await fetch('/api/conditions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({spot, activity, days})
    });

    const data = await res.json();
    displayResults(data);
});

function displayResults(data) {
  const resultsDiv = document.getElementById('results');

  if (data.error) {
    resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
    return;
  }

  let html = `<h2>${data.spot}, ${data.country}</h2>`;
  html += `<p>Activity: ${data.activity}</p>`;
  html += `<table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Wave Height (m)</th>
        <th>Swell Period (s)</th>
        <th>Wind (km/h)</th>
        <th>Temp High (°C)</th>
        <th>Rain (mm)</th>
      </tr>
    </thead>
    <tbody>`;

  data.forecast.forEach(day => {
    html += `<tr>
      <td>${day.date}</td>
      <td>${day.wave}</td>
      <td>${day.swell}</td>
      <td>${day.wind}</td>
      <td>${day.tempMax}</td>
      <td>${day.precip}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  resultsDiv.innerHTML = html;
}