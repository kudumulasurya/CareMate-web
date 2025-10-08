export async function predictDiseases(symptoms: string) {
  // Deterministic mocked response
  const text = symptoms.toLowerCase()
  const preds =
    text.includes("fever") || text.includes("cough")
      ? [
          { disease: "Common Cold", probability: 0.67 },
          { disease: "Flu", probability: 0.23 },
        ]
      : [{ disease: "General Checkup Recommended", probability: 0.8 }]
  return {
    predictions: preds,
    explanation: "This is a mocked prediction based on keyword matching for demonstration purposes.",
    modelUsed: "mock-llama",
    modelVersion: "v0.1",
  }
}
