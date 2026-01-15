export async function getAIRecommendation(req, res, userPrompt, products) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Construct the prompt for the AI model
    try {
        const geminiPrompt = `
        Here is a list of avaiable products:
        ${JSON.stringify(products, null, 2)}

        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Only return the matching products in JSON format.
    `;

        // Make the API request to the Gemini model
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: geminiPrompt }] }],
            }),
        });

        const data = await response.json();
        console.log("Gemini API response:", data);
        // Extract and clean the AI response
        const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        console.log("AI Response Text:", aiResponseText);
        // Remove any markdown formatting if present
        const cleanedText = aiResponseText.replace(/```json|```/g, ``).trim();

        // Validate and parse the AI response
        if (!cleanedText) {
            return res
                .status(500)
                .json({ success: false, message: "AI response is empty or invalid." });
        }

        let parsedProducts;

        // Attempt to parse the cleaned text as JSON
        try {
            parsedProducts = JSON.parse(cleanedText);
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Failed to parse AI response" });
        }
        return { success: true, products: parsedProducts };
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}