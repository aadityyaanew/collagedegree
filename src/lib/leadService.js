/**
 * Lead Service for Counselling Requests
 * Submits data directly to the Next.js API route which stores it in MongoDB
 * and makes it available in the Admin Panel.
 */

export async function submitCounsellingData(data) {
  const timestamp = new Date().toISOString();
  const submissionRecord = {
    ...data,
    submittedAt: timestamp,
    id: `CD-${Date.now().toString(36).toUpperCase()}`,
  };

  // 1. Always store locally in localStorage for resilience & offline proof
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(
        localStorage.getItem("cc_counselling_leads") || "[]"
      );
      existing.unshift(submissionRecord);
      localStorage.setItem(
        "cc_counselling_leads",
        JSON.stringify(existing.slice(0, 50))
      );
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  // 2. Submit to internal Next.js API route (MongoDB)
  let apiSuccess = false;
  try {
    const res = await fetch("/api/counselling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionRecord),
    });
    
    if (res.ok) {
      apiSuccess = true;
    } else {
      console.warn("API returned error status:", res.status);
    }
  } catch (err) {
    console.error("API route submission failed:", err);
  }

  return {
    success: apiSuccess,
    recordId: submissionRecord.id,
    message: apiSuccess ? "Counselling request registered successfully!" : "There was a problem submitting your request.",
  };
}
