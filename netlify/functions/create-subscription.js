const PLAN_ID = "plan_TNdDWIY6A1EtAI";
const TOTAL_COUNT = 3; // 3 monthly cycles of ₹5,000, first one topped up to ₹10,000 via addon

exports.handler = async function () {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { statusCode: 500, body: "Razorpay keys not configured on the server." };
  }

  const auth = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_id: PLAN_ID,
      total_count: TOTAL_COUNT,
      customer_notify: 1,
      addons: [
        {
          item: {
            name: "First instalment top-up",
            amount: 500000,
            currency: "INR",
          },
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: 502,
      body: `Could not start a subscription right now: ${data.error?.description || "unknown error"}`,
    };
  }

  return {
    statusCode: 302,
    headers: { Location: data.short_url },
  };
};
