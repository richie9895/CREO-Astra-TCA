import { allLeads, allLeadsReady, Lead } from "./getData.js";

//default sorting based on default developed scores

export interface weightings{
    lead_id_weight:number;
    lead_date_weight:number;
    property_type_weight:number
    neighbourhood_weight:number;
    estimated_job_size_sqft_weight:number
    requested_timeline_weight:number;
    referral_source_weight:number
    homeowner_status_weight:number;
    preferred_contact_weight:number
    lead_capture_weather_weight:number;
    distance_to_queens_km_weight:number
    customer_age_bracket_weight:number;
    has_pets_weight:number
    lead_weekday_weight:number;
    expected_profit_band_weight:number;
}

export interface defaultScoring{
    lead_id_score:number;
    lead_date_score:number;
    property_type_score:Record<string, number>
    neighbourhood_score:Record<string, number>;
    estimated_job_size_sqft_score:0;
    requested_timeline_score:Record<string, number>;
    referral_source_score:Record<string, number>
    homeowner_status_score:Record<string, number>;
    preferred_contact_score:number;
    lead_capture_weather_score:number;
    distance_to_queens_km_score:0;
    customer_age_bracket_score:Record<string, number>;
    has_pets_score:0;
    lead_weekday_score:Record<string, number>;
    expected_profit_band_score:Record<string, number>;
}

export const defaultWeights:weightings = {
    lead_id_weight: 0,
    lead_date_weight: 1,
    property_type_weight: 8,
    neighbourhood_weight: 6,
    estimated_job_size_sqft_weight: 10,
    requested_timeline_weight: 11,
    referral_source_weight: 3,
    homeowner_status_weight: 9,
    preferred_contact_weight: 0,
    lead_capture_weather_weight: 0,
    distance_to_queens_km_weight: 4,
    customer_age_bracket_weight: 7,
    has_pets_weight: 5,
    lead_weekday_weight: 2,
    expected_profit_band_weight: 12
}

const defaultScores:defaultScoring = {
    lead_id_score: 0,
    lead_date_score:0,
    property_type_score: {
        'Townhouse':1,
        'Detached':4,
        'Apartment':0,
        'Semi-Detached':2,
        'Heritage Home':3
    },
    neighbourhood_score: {
        " Calvin Park ":1,
        "Calvin Park":1,
        "Down Town":1,
        "Downtown":1,
        "Portsmoth Village":1,
        "Portsmouth Village":1,
        "Strathcona Park":1,
        "Sydenham Ward":1,
        "Sydenhamm Ward":1,
        "West End":1,
        "Westend":1
    },
    estimated_job_size_sqft_score: 0,
    requested_timeline_score: {
        "1 month":1,
        "1-2 weeks":2,
        "ASAP":3,
        "Flexible":0
    },
    referral_source_score: {
        "Door 2 Door":2,
        "Door-to-Door":2,
        "FaceBook":1,
        "Facebook Ads":1,
        "Lawn Signs":1,
        "LawnSign":1,
        "Word of Mouth/Referral": 3
    },
    homeowner_status_score: {
        "Own":2,
        "Recently Purchased":3,
        "Rent":0
    },
    preferred_contact_score: 0,
    lead_capture_weather_score: 0,
    distance_to_queens_km_score: 0,
    customer_age_bracket_score: {
        "18-24":2,
        "25-34":6,
        "35-44":5,
        "45-54":4,
        "55-64":3,
        "65+":1,
        null:0
    },
    has_pets_score:0,
    lead_weekday_score: {
        "Friday":1,
        "Monday":1,
        "Saturday":1,
        "Sunday":1,
        "Thursday":1,
        "Tuesday":1,
        "Wednesday":1
    },
    expected_profit_band_score: {
        "High":3,
        "Low":1,
        "Medium":2,
        null:0
    }
}

async function pullUniqueData() {
    await allLeadsReady; 
    const uniqueIds = [...new Set(allLeads.map(lead => lead.lead_id))];
    const uniqueDates = [...new Set(allLeads.map(lead => lead.lead_date))];
    const uniquePropertyTypes = [...new Set(allLeads.map(lead => lead.property_type))];
    const uniqueNeighbourhoods = [...new Set(allLeads.map(lead => lead.neighbourhood))];
    const uniqueEstimatedJobSize = [...new Set(allLeads.map(lead => lead.estimated_job_size_sqft))];
    const uniqueRequestedTimelines = [...new Set(allLeads.map(lead => lead.requested_timeline))];
    const uniqueReferralSources = [...new Set(allLeads.map(lead => lead.referral_source))];
    const uniqueHomeownerStatuses = [...new Set(allLeads.map(lead => lead.homeowner_status))];
    const uniquePreferredContacts = [...new Set(allLeads.map(lead => lead.preferred_contact))];
    const uniqueLeadCaptureWeathers = [...new Set(allLeads.map(lead => lead.lead_capture_weather))];
    const uniqueDistanceToQueens = [...new Set(allLeads.map(lead => lead.distance_to_queens_km))];
    const uniqueCustomerAgeBrackets = [...new Set(allLeads.map(lead => lead.customer_age_bracket))];
    const uniqueHasPets = [...new Set(allLeads.map(lead => lead.has_pets))];
    const uniqueLeadWeekdays = [...new Set(allLeads.map(lead => lead.lead_weekday))];
    const uniqueExpectedProfitBands = [...new Set(allLeads.map(lead => lead.expected_profit_band))];
    console.log(uniqueIds);
}

export async function runAnalysis(weights:weightings) {
    await allLeadsReady; 
    const today = new Date();
    var leadDate:Date = new Date();
    //prune repeated data
    const uniqueLeads = Array.from(new Map(allLeads.map(lead => [lead.lead_id, lead])).values());
    uniqueLeads.forEach((lead) => {
        //handle date scoring - more recent equals higher scores
        leadDate = dateNormalisation(lead)!;

        const diffInMs = today.getTime() - leadDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        lead.score = lead.score + Math.floor((365 - diffInDays) * weights.lead_date_weight * 1/365);

        //handle all other scoring:
        lead.score = lead.score + Math.floor(defaultScores.property_type_score[lead.property_type] * weights.property_type_weight * 1/4);
        lead.score = lead.score + Math.floor(defaultScores.neighbourhood_score[lead.neighbourhood] * weights.neighbourhood_weight * 1/3);
        lead.score = lead.score + Math.floor(defaultScores.requested_timeline_score[lead.requested_timeline] * weights.requested_timeline_weight * 1/3);
        lead.score = lead.score + Math.floor(defaultScores.referral_source_score[lead.referral_source] * weights.referral_source_weight * 1/3);
        lead.score = lead.score + Math.floor(defaultScores.homeowner_status_score[lead.homeowner_status] * weights.homeowner_status_weight * 1/3);
        lead.score = lead.score + Math.floor(defaultScores.customer_age_bracket_score[lead.customer_age_bracket] * weights.customer_age_bracket_weight * 1/6);
        lead.score = lead.score + Math.floor(defaultScores.expected_profit_band_score[lead.expected_profit_band] * weights.expected_profit_band_weight * 1/3);

        //handle distance scoring, closer jobs have greater scores
        lead.score = lead.score + Math.floor((50- lead.distance_to_queens_km * weights.distance_to_queens_km_weight)*1/50);

        //handle pets
        if(lead.has_pets === false){
            lead.score = lead.score + 1;
        }

        if(lead.estimated_job_size_sqft !== null){
            //handle square footage scoring, larger jobs have greater scores
            lead.score = lead.score + Math.floor(lead.estimated_job_size_sqft * weights.estimated_job_size_sqft_weight * 1/4000);
        }

        //no profit from non profitable jobs
        if(lead.expected_profit_band === null){
            lead.score = 0;
        }
    });
    console.log(uniqueLeads.sort((a,b) => b.score - a.score));
    return uniqueLeads.sort((a,b) => b.score - a.score);
}

function dateNormalisation(currentLead:Lead) {
    // ISO format: 2026-02-21
    if (/^\d{4}-\d{2}-\d{2}$/.test(currentLead.lead_date)) {
        return new Date(currentLead.lead_date);
    }

    // US format: 01/24/2026
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(currentLead.lead_date)) {
        const [month, day, year] = currentLead.lead_date.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    // Text format: 14-Feb-2026
    if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(currentLead.lead_date)) {
        return new Date(currentLead.lead_date);
    }

}

runAnalysis(defaultWeights);