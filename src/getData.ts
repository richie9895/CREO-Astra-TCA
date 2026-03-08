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

export async function getAllLeads(): Promise<LeadElements[]> {

    const LIMIT = 250; // server cap
    let start = 0;
    let allLeads: LeadElements[] = [];

    while (true) {

        const end = start + LIMIT - 1;

        const response = await fetch(
            "https://dqcqexieqlfqylqwogsj.supabase.co/rest/v1/inbound_leads?select=*",
            {
                method: "GET",
                headers: {
                    apikey: "sb_publishable_iFgXlEVP5UqmrZx6l1nVgw_6WD5CPpy",
                    Authorization: "Bearer sb_publishable_iFgXlEVP5UqmrZx6l1nVgw_6WD5CPpy",
                    "Content-Type": "application/json",
                    "Range-Unit": "items",
                    "Range": `${start}-${end}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data: LeadElements[] = await response.json();
        allLeads = [...allLeads, ...data];

        if (data.length < LIMIT) break;

        start += LIMIT;
    }

    console.log("Total leads:", allLeads.length);
    return allLeads;
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


