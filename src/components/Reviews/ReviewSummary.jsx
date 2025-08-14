import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

export async function GeminiSummary({ restaurantId }) {
  const { app } = await getAuthenticatedAppForUser();
  const db = getFirestore(app);
  const reviews = await getReviewsByRestaurantId(db, restaurantId);
  console.log({ reviews });
  const reviewSeparator = "@";
  const prompt = `
  Based on the following restaurant reviews, 
  where each review is separated by a '${reviewSeparator}' character, 
  create a one-sentence summary of what people think of the restaurant. 

  Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set. Set it with "firebase apphosting:secrets:set GEMINI_API_KEY"');
    }

    const ai = genkit({
      plugins: [googleAI()],
      model: gemini20Flash,
    });
    const { text } = await ai.generate(prompt);

    return (
      <div className="restaurant__review_summary">
        <p>TODO: summarize reviews</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return <p>Error summarizing reviews.</p>;
  }
}

export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}
