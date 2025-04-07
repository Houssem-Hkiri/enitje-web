# Google Analytics Integration

This application supports integration with Google Analytics 4 (GA4) to display real analytics data on your dashboard.

## Setup Instructions

### 1. Google Analytics Account Setup

1. If you don't already have a Google Analytics account, create one at [analytics.google.com](https://analytics.google.com/)
2. Set up a GA4 property for your website
3. Note your Measurement ID (format: G-XXXXXXXXXX)

### 2. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Google Analytics Data API
   - Google Search Console API (optional, for search data)

### 3. Create a Service Account

1. In your Google Cloud project, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "analytics-api-access")
4. Grant it the necessary roles:
   - For Analytics: "Google Analytics Data Viewer" role
   - For Search Console: "Search Console API - API Restricted Data Access" role
5. Create a key for the service account (JSON format)
6. Save the downloaded JSON file securely

### 4. Grant Access to Your Analytics Property

1. In Google Analytics, go to Admin > Property > Property Access Management
2. Add the service account email address and grant it "Viewer" access

### 5. Configure Your Application

1. Copy `.env.local.example` to `.env.local`
2. Set `NEXT_PUBLIC_GA_ID` to your GA4 Measurement ID
3. Set `GOOGLE_SERVICE_ACCOUNT_KEY` to the entire contents of your service account JSON key file (as a single line)
4. If using Search Console, set `NEXT_PUBLIC_SITE_URL` to your website URL

Example:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

### 6. Build and Run

After setting up the environment variables, restart your application. The analytics dashboard should now display real data from your Google Analytics account.

## Troubleshooting

### No Data Showing

- Ensure your Google Analytics property has active traffic
- Verify the service account has proper access permissions
- Check for any error messages in the browser console or server logs

### API Errors

- Confirm the APIs are enabled in your Google Cloud project
- Verify the service account key is properly formatted in the environment variable
- Check that the GA4 property ID is correct

### Fallback to Mock Data

If the application cannot connect to Google Analytics APIs, it will automatically fall back to showing mock data. The dashboard will indicate whether it's displaying real or mock data.

## Security Notes

- Never commit your service account key to version control
- Use environment variables or a secure secret management system
- Consider restricting the service account's permissions to only what is necessary 