const AIRTABLE_ENDPOINT = "https://api.airtable.com/v0/apppYs7BLYuN6JQsH/Subscribers";

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

module.exports = async function handler(request, response) {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.AIRTABLE_TOKEN?.trim();

  if (!token) {
    console.error("Subscribe failed: AIRTABLE_TOKEN is not configured.");
    return response.status(500).json({ error: "Airtable token is not configured" });
  }

  const { name, email } = parseBody(request.body);

  if (!name || !email) {
    console.error("Subscribe failed: missing name or email.", {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      bodyType: typeof request.body
    });
    return response.status(400).json({ error: "Name and email are required" });
  }

  try {
    console.log("Subscribe request forwarding to Airtable.", {
      hasToken: Boolean(token),
      tokenLength: token.length,
      hasName: Boolean(name),
      hasEmail: Boolean(email)
    });

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
      const airtableError = await airtableResponse.text();

      console.error("Airtable request failed.", {
        status: airtableResponse.status,
        statusText: airtableResponse.statusText,
        body: airtableError
      });

      return response.status(airtableResponse.status).json({
        error: "Airtable request failed"
      });
    }

    console.log("Subscribe request succeeded.");
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Subscribe request failed before Airtable completed.", error);
    return response.status(500).json({ error: "Subscription request failed" });
  }
};
