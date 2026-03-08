export interface LeadElements {
  lead_id: string;
  lead_date: string;
  property_type: string;
  neighbourhood: string;
  estimated_job_size_sqft: number;
  requested_timeline: string;
  referral_source: string;
  homeowner_status: string;
  preferred_contact: string;
  lead_capture_weather: string;
  distance_to_queens_km: number;
  customer_age_bracket: string;
  has_pets:boolean;
  lead_weekday: string;
  expected_profit_band: string;
}

export async function getAllLeads(offset: number = 0, allLeads: LeadElements[] = []): Promise<LeadElements[]> {
    const LIMIT = 500; 
    const url = `https://dqcqexieqlfqylqwogsj.supabase.co/rest/v1/inbound_leads?limit=${LIMIT}&offset=${offset}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': 'sb_publishable_iFgXlEVP5UqmrZx6l1nVgw_6WD5CPpy',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json() as LeadElements[];
    const updatedLeads = [...allLeads, ...data];

    if (data.length === LIMIT) {
        return getAllLeads(offset + LIMIT, updatedLeads);
    }

    return updatedLeads;
}
