const AIRTABLE_ENDPOINT = "https://api.airtable.com/v0/appYs7BLYuN6JQsH/Subscribers";

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.AIRTABLE_TOKEN;

  if (!token) {
    return response.status(500).json({ error: "Airtable token is not configured" });
  }

  const { name, email } = request.body || {};

  if (!name || !email) {
    return response.status(400).json({ error: "Name and email are required" });
  }

  try {
    const airtableResponse = await fetch(AIRTABLE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          Email: email
        }
      })
    });

    if (!airtableResponse.ok) {
      return response.status(airtableResponse.status).json({
        error: "Airtable request failed"
      });
    }

    return response.status(200).json({ ok: true });
  } catch {
    return response.status(500).json({ error: "Subscription request failed" });
  }
};
