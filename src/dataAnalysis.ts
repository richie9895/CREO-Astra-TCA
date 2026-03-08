import { allLeads, ensureLeadsLoaded } from "./getData";

// ensure leads are fetched once; subsequent imports can just read `allLeads`.
(async () => {
  await ensureLeadsLoaded();
  console.log(allLeads);
})();


