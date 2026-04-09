# Baseball App Intelligence Web

**Prod:** <https://baseball-app.bernsonllc.com> | **Dev:** <https://baseball-app-dev.bernsonllc.com>

React SPA for Baseball App Intelligence — interactive baseball scenario quizzes.

![architecture](architecture/architecture.drawio)

## Stack

- React 19, TypeScript (strict), Vite 6
- Tailwind CSS v4
- TanStack Query v5
- React Router 7
- Cognito OAuth2 PKCE (jose for JWT verification)
- Vitest + React Testing Library

## Setup

```bash
npm install
```

## Development

Create `.env` with Cognito configuration:

```
VITE_COGNITO_DOMAIN=https://baseball-app-auth.bernsonllc.com
VITE_COGNITO_CLIENT_ID=4219hobas0o41mlv5n09ogukm1
VITE_COGNITO_USER_POOL_ID=us-east-1_yOhHWnfvA
VITE_COGNITO_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_COGNITO_LOGOUT_URI=http://localhost:5173
VITE_AWS_REGION=us-east-1
```

Start the dev server:

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Deployment

Automated via GitHub Actions — push to `main` builds and deploys to S3 + invalidates CloudFront.

### GitHub Actions Variables

| Variable | Description |
|----------|-------------|
| `AWS_REGION` | AWS region |
| `GHA_ROLE_ARN` | IAM role ARN from infra `terraform output gha_role_arns` key `web` |
| `S3_BUCKET` | From infra `terraform output web_bucket_name` |
| `CF_DISTRIBUTION_ID` | From infra `terraform output cloudfront_distribution_id` |
| `COGNITO_DOMAIN` | From infra `terraform output cognito_domain` |
| `COGNITO_CLIENT_ID` | From infra `terraform output cognito_client_id` |
| `COGNITO_USER_POOL_ID` | From infra `terraform output cognito_user_pool_id` |
| `COGNITO_REDIRECT_URI` | e.g. `https://baseball-app.bernsonllc.com/auth/callback` |
| `COGNITO_LOGOUT_URI` | e.g. `https://baseball-app.bernsonllc.com` |
