import axios from "axios";

// Use this if you want to make a call to OpenAI GPT for instance. userId is used to identify the user on openAI side.
export const sendOpenAi = async (messages, userId, max = 100, temp = 1) => {
  const url = "https://api.openai.com/v1/chat/completions";

  console.log("Ask GPT >>>");
  messages.map((m) =>
    console.log(" - " + m.role.toUpperCase() + ": " + m.content)
  );

  // Try models in order of cost-effectiveness (cheapest first)
  const models = ["gpt-4o-mini"]; // Only use the cheapest, best model
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      
      const body = JSON.stringify({
        model: model,
        messages,
        max_tokens: max,
        temperature: temp,
        user: userId,
      });

      const options = {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(url, body, options);

      const answer = res.data.choices[0].message.content;
      const usage = res?.data?.usage;

      console.log(`✅ Success with model: ${model}`);
      console.log(">>> " + answer);
      console.log(
        "TOKENS USED: " +
          usage?.total_tokens +
          " (prompt: " +
          usage?.prompt_tokens +
          " / response: " +
          usage?.completion_tokens +
          ")"
      );
      console.log("\n");

      return answer;
      
    } catch (e) {
      console.error(`❌ Failed with model ${model}:`, e?.response?.status, e?.response?.data?.error?.message || e.message);
      
      // If this was the last model, return null
      if (model === models[models.length - 1]) {
        console.error("All models failed. Returning null.");
        return null;
      }
      
      // Otherwise, continue to the next model
      console.log("Trying next model...");
      continue;
    }
  }
  
  return null;
};
