import { getAllLeads, LeadElements } from "./getData";

(async () => {
    const allLeads: LeadElements[] = await getAllLeads();
    
    const fields: (keyof LeadElements)[] = ['lead_id', 'lead_date', 'property_type', 'neighbourhood', 'estimated_job_size_sqft', 'requested_timeline', 'referral_source', 'homeowner_status', 'preferred_contact'];
    
    fields.forEach(field => {
        const uniqueValues = new Set<LeadElements[typeof field]>();
        allLeads.forEach(lead => uniqueValues.add(lead[field]));
        console.log(`Unique ${field}:`);
        uniqueValues.forEach(value => console.log(value));
        console.log(''); 
    });
})();

