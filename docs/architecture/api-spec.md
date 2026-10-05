# API specification reference

The API is rooted at `/api` and returns JSON.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Create a user and issue a bearer token |
| POST | `/auth/login` | No | Validate credentials and issue a token |
| GET | `/auth/me` | Bearer | Return the current profile |
| GET | `/trips` | Bearer | List trips visible to the user |
| POST | `/trips` | Bearer | Create an itinerary |
| PATCH | `/trips/{id}` | Owner | Mutate an itinerary with a required version |
| DELETE | `/trips/{id}` | Owner | Remove an itinerary |
| POST | `/ai/itinerary` | Service auth | Request a generated itinerary |
| POST | `/payments/checkout` | Bearer | Create a provider checkout session |
| POST | `/payments/webhooks/{provider}` | Signature | Receive a verified provider event |

Error responses use `{ "detail": string }`. Mutating requests are validated at the boundary and return `409` when the supplied trip version is stale.
