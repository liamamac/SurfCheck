const form = document.getElementById('conditionsForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const spot = document.getElementById('spot').value;
    const activity = document.getElementById('input[name="activity"]:checked').value;
    const days = document.getElementById('days').value;

    const res = await fetch('/api/conditions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({spot, activity, days})
    });

    const data = await res.json();
    displayResults(data);

    function displayResults() {
        
    }
})