const PLAN_ID = "plan_TNVSw1F3x4jBSa";
const TOTAL_COUNT = 4; // 4 monthly instalments of ₹5,000

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
