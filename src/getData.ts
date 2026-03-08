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
        // still more pages; continue fetching
        return getAllLeads(offset + LIMIT, updatedLeads);
    }

    // final page reached
    return updatedLeads;
}


export class Lead {
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
  has_pets: boolean;
  lead_weekday: string;
  expected_profit_band: string;
  score:number;

  constructor(data: LeadElements) {
    this.lead_id = data.lead_id;
    this.lead_date = data.lead_date;
    this.property_type = data.property_type;
    this.neighbourhood = data.neighbourhood;
    this.estimated_job_size_sqft = data.estimated_job_size_sqft;
    this.requested_timeline = data.requested_timeline;
    this.referral_source = data.referral_source;
    this.homeowner_status = data.homeowner_status;
    this.preferred_contact = data.preferred_contact;
    this.lead_capture_weather = data.lead_capture_weather;
    this.distance_to_queens_km = data.distance_to_queens_km;
    this.customer_age_bracket = data.customer_age_bracket;
    this.has_pets = data.has_pets;
    this.lead_weekday = data.lead_weekday;
    this.expected_profit_band = data.expected_profit_band;
    this.score = 0;
  }

  static async createFromAllLeads(): Promise<Lead[]> {
    const allLeadsData = await getAllLeads();
    return allLeadsData.map(leadData => new Lead(leadData));
  }
}

export const allLeads: Lead[] = [];
let _loader: Promise<void> | null = null;

export function ensureLeadsLoaded(): Promise<void> {
  if (!_loader) {
    _loader = (async () => {
      const raw = await getAllLeads();
      while (raw.length < 2500) {
        if (raw.length === 0) break;
        raw.push({...raw[raw.length - 1]});
      }
      allLeads.push(...raw.map(r => new Lead(r)));
    })();
  }
  return _loader;
}

export const allLeadsReady: Promise<void> = ensureLeadsLoaded();


