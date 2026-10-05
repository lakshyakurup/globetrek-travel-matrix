export const config = {
  target: process.env.API_URL || "http://localhost:8000",
  phases: [{ duration: 30, arrivalRate: 5, name: "warmup" }, { duration: 60, arrivalRate: 20, name: "steady state" }],
  defaults: { headers: { accept: "application/json" } },
};
export const scenarios = [{ name: "health and trip reads", flow: [{ get: { url: "/health" } }, { get: { url: "/api/trips" } }] }];
