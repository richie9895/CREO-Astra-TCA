import { runAnalysis, defaultWeights } from '/dist/dataAnalysis.js';

async function updateUI() {
    var currentWeights = getCurrentWeights();
    var leads = await runAnalysis(currentWeights);
    console.log(getCurrentWeights());
    displayLeads(leads);
}

async function resetUI(){
    var leads = await runAnalysis(defaultWeights);
    const date_slider = document.getElementById("lead_date_weight");
        if (date_slider) {
            date_slider.value = 1;
        }
    const property_slider = document.getElementById("property_type_weight");
        if (property_slider) {
            property_slider.value = 8;
        }
    const neighbourhood_slider = document.getElementById("neighbourhood_weight");
        if (neighbourhood_slider) {
            neighbourhood_slider.value = 6;
        }
    const job_size_slider = document.getElementById("estimated_job_size_weight");
        if (job_size_slider) {
            job_size_slider.value = 10;
        }
    const timeline_slider = document.getElementById("requested_timeline_weight");
        if (timeline_slider) {
            timeline_slider.value = 11;
        }
    const referral_slider = document.getElementById("referral_source_weight");
        if (referral_slider) {
            referral_slider.value = 3;
        }
    const homeowner_slider = document.getElementById("homeowner_status_weight");
        if (homeowner_slider) {
            homeowner_slider.value = 9;
        }
    const contact_slider = document.getElementById("preferred_contact_weight");
        if (contact_slider) {
            contact_slider.value = 0;
        }
    const weather_slider = document.getElementById("capture_weather_weight");
        if (weather_slider) {
            weather_slider.value = 0;
        }
    const distance_slider = document.getElementById("distance_weight");
        if (distance_slider) {
            distance_slider.value = 4;
        }
    const age_slider = document.getElementById("customer_age_bracket_weight");
        if (age_slider) {
            age_slider.value = 7;
        }
    const pets_slider = document.getElementById("has_pets_weight");
        if (pets_slider) {
            pets_slider.value = 5;
        }
    const weekday_slider = document.getElementById("weekday_weight");
        if (weekday_slider) {
            weekday_slider.value = 2;
        }
    const profit_slider = document.getElementById("expected_profit_band_weight");
        if (profit_slider) {
            profit_slider.value = 12;
        }
    displayLeads(leads);
}

function getCurrentWeights() {
    return {
        lead_id_weight: 0,
        lead_date_weight: parseFloat(document.getElementById('lead_date_weight').value),
        property_type_weight: parseFloat(document.getElementById('property_type_weight').value),
        neighbourhood_weight: parseFloat(document.getElementById('neighbourhood_weight').value),
        estimated_job_size_sqft_weight: parseFloat(document.getElementById('estimated_job_size_weight').value),
        requested_timeline_weight: parseFloat(document.getElementById('requested_timeline_weight').value),
        referral_source_weight: parseFloat(document.getElementById('referral_source_weight').value),
        homeowner_status_weight: parseFloat(document.getElementById('homeowner_status_weight').value),
        preferred_contact_weight: parseFloat(document.getElementById('preferred_contact_weight').value),
        lead_capture_weather_weight: parseFloat(document.getElementById('capture_weather_weight').value),
        distance_to_queens_km_weight: parseFloat(document.getElementById('distance_weight').value),
        customer_age_bracket_weight: parseFloat(document.getElementById('customer_age_bracket_weight').value),
        has_pets_weight: parseFloat(document.getElementById('has_pets_weight').value),
        lead_weekday_weight: parseFloat(document.getElementById('weekday_weight').value),
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
                    <p>${lead.property_type} • ${lead.neighbourhood} • ${lead.distance_to_queens_km} km (From Queen's)</p>
                    <small class="metadata">
                        Timeline: ${lead.requested_timeline} | Profit: ${lead.expected_profit_band} | Contact: ${lead.preferred_contact}
                    </small>
                </div>
            </div>
            <div class="score-container">
                <div class="score-badge">${Math.round(lead.score)}</div>
                <small>Priority Score</small>
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