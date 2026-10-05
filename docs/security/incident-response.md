# Security incident response

## Detect and triage

Page the on-call engineer for credential exposure, unauthorized access, payment anomalies, or data exfiltration. Preserve request IDs, audit records, deployment identifiers, and provider event IDs. Do not delete or rewrite evidence.

## Contain

Revoke affected sessions and API keys, disable compromised integrations, restrict the impacted route, and apply a least-privilege emergency policy. For suspected payment compromise, notify the payment provider before changing webhook configuration.

## Eradicate and recover

Identify the vulnerable change, rotate secrets, patch and peer-review the fix, scan the resulting image, and redeploy using the documented rollback path if necessary. Restore from a verified backup only after integrity checks.

## Notify and learn

Security owns regulatory assessment and customer communication. Record timeline, scope, data categories, affected subjects, decisions, and follow-up controls. Run a blameless review within five business days.
