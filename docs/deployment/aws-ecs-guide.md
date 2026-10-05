# AWS ECS deployment

1. Create an ECR repository and an ECS cluster with Fargate capacity.
2. Create a task definition containing the backend image, database/Redis endpoints, and secrets from AWS Secrets Manager.
3. Configure a target group health check against `/health`; place the service behind an HTTPS Application Load Balancer.
4. Grant the task role only the ECR pull, CloudWatch logs, Secrets Manager read, and required storage permissions.
5. Configure `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `ECR_REGISTRY`, `ECS_CLUSTER`, and `ECS_SERVICE` in the deployment environment.
6. Publish an immutable image tag and update the service with `aws ecs update-service --force-new-deployment`.
7. Wait for deployment stability, verify API health and dashboard login, then record the image digest and migration checksum.

Rollback by redeploying the previous task-definition revision. Database migrations must be backward compatible before application rollout.
