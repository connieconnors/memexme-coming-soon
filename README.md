# MemexMe Coming Soon

A single-file static coming-soon page for MemexMe.com.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Airtable

The form currently posts to placeholder Airtable values in `index.html`:

- `YOUR_BASE_ID`
- `YOUR_TABLE_NAME`
- `YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN`

Replace those before launch, or route the submission through a backend/serverless function to avoid exposing an Airtable token in client-side code.

## GitHub Pages

After the repository is pushed to GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set the source to the `main` branch and root folder.
4. Save and wait for GitHub Pages to publish the site.
