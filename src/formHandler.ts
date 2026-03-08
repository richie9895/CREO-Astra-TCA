import { LeadElements } from "./getData";

// grab the form element
const form = document.getElementById("lead-form") as HTMLFormElement | null;

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);

    // build object using names defined on inputs
    const lead: LeadElements = {
      lead_id: data.get("lead_id") as string,
      lead_date: data.get("lead_date") as string,
      property_type: data.get("property_type") as string,
      neighbourhood: data.get("neighbourhood") as string,
      estimated_job_size_sqft: Number(data.get("estimated_job_size_sqft")),
      requested_timeline: data.get("requested_timeline") as string,
      referral_source: data.get("referral_source") as string,
      homeowner_status: data.get("homeowner_status") as string,
      preferred_contact: data.get("preferred_contact") as string,
      lead_capture_weather: data.get("lead_capture_weather") as string,
      distance_to_queens_km: Number(data.get("distance_to_queens_km")),
      customer_age_bracket: data.get("customer_age_bracket") as string,
      has_pets: data.get("has_pets") === "true",
      lead_weekday: data.get("lead_weekday") as string,
      expected_profit_band: data.get("expected_profit_band") as string
    };

    console.log("lead from form", lead);
    // you could send `lead` to your API here or add to allLeads array
  });
} else {
  console.warn("lead-form not found in document");
}
