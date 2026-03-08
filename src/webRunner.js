import { runAnalysis, defaultWeights } from '/dist/dataAnalysis.js';

async function updateUI() {

    var leads = await runAnalysis(defaultWeights);
    displayLeads(leads);

}

function displayLeads(leads) {
    const listContainer = document.getElementById('lead-list');
    
    // 1. Clear the loader or old leads
    listContainer.innerHTML = '';

    // 2. Iterate and create cards
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

// Initial Load
updateUI();