import { allLeads, ensureLeadsLoaded } from "./getData";

// ensure leads are fetched once; subsequent imports can just read `allLeads`.
(async () => {
  await ensureLeadsLoaded();
  console.log(`loaded ${allLeads.length} leads`);
  // print first few to verify
  console.log(allLeads.slice(0, 5));
})();
