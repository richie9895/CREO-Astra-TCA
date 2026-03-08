import { runAnalysis, defaultWeights } from '/dist/dataAnalysis.js';

async function updateUI() {
    var currentWeights = getCurrentWeights();
    var leads = await runAnalysis(currentWeights);
    console.log(getCurrentWeights());
    displayLeads(leads);
}

async function resetUI(){
    var leads = await runAnalysis(defaultWeights);
    displayLeads(leads);
}

function getCurrentWeights() {
    return {
        lead_id_weight: 0,
        lead_date_weight: parseFloat(document.getElementById('lead_date_weight').value),
        property_type_weight: parseFloat(document.getElementById('property_type_weight').value),
        neighbourhood_weight: parseFloat(document.getElementById('neighbourhood_weight').value),
        estimated_job_size_sqft_weight: 0,
        requested_timeline_weight: parseFloat(document.getElementById('requested_timeline_weight').value),
        referral_source_weight: parseFloat(document.getElementById('referral_source_weight').value),
        homeowner_status_weight: parseFloat(document.getElementById('homeowner_status_weight').value),
        preferred_contact_weight: 0,
        lead_capture_weather_weight: 0,
        distance_to_queens_km_weight: 0,
        customer_age_bracket_weight: parseFloat(document.getElementById('customer_age_bracket_weight').value),
        has_pets_weight: 0,
        lead_weekday_weight: 0,
        expected_profit_band_weight: parseFloat(document.getElementById('expected_profit_band_weight').value)
    };
}

function displayLeads(leads) {
    const listContainer = document.getElementById('lead-list');

    listContainer.innerHTML = '';

    leads.forEach((lead, index) => {
        const card = document.createElement('div');
        card.className = 'lead-card';

        card.innerHTML = `
            <div class="lead-info">
                <span class="rank-number">#${index + 1}</span>
                <div class="details">
                    <strong>Lead ID: ${lead.lead_id}</strong>
                    <p>${lead.property_type} • ${lead.neighbourhood}</p>
                    <small class="metadata">
                        Timeline: ${lead.requested_timeline} | Profit: ${lead.expected_profit_band}
                    </small>
                </div>
            </div>
            <div class="score-container">
                <div class="score-badge">${Math.round(lead.score)}</div>
                <small>Astra Score</small>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

document.querySelectorAll('#controls input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => {
        updateUI(); 
    });
});

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {   
    resetUI();
});

resetUI();