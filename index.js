import { pipeline, env } from
    "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.0.1";

env.allowLocalModels = false;

const responseBox = document.getElementById("response");
const button = document.querySelector("button");

let generator = null;

async function loadAI() {
    responseBox.innerHTML =
        "⏳ Loading the AI model... This may take a little while the first time.";

    generator = await pipeline(
        "text2text-generation",
        "Xenova/flan-t5-small"
    );

    responseBox.innerHTML =
        "✅ StudyBuddy AI is ready! Enter a Python concept.";
}

async function explainTopic() {

    const topic = document.getElementById("topic").value.trim();

    if (!topic) {
        responseBox.innerHTML =
            "Please enter a Python topic first.";
        return;
    }

    if (!generator) {
        responseBox.innerHTML =
            "⏳ The AI model is still loading. Please wait.";
        return;
    }

    button.disabled = true;
    responseBox.innerHTML =
        "🤖 StudyBuddy is creating your explanation...";

    try {

        const prompt = `
Explain the Python programming concept "${topic}"
to a beginner.

Use simple language.
Give one short real-world analogy.
Give one small Python code example.
Keep the explanation concise.
`;

        const result = await generator(prompt, {
            max_new_tokens: 180,
            temperature: 0.7
        });

        responseBox.innerHTML =
            "<strong>🤖 StudyBuddy:</strong><br><br>" +
            result[0].generated_text.replace(/\n/g, "<br>");

    } catch (error) {

        console.error(error);

        responseBox.innerHTML =
            "❌ Something went wrong while running the AI.";

    } finally {

        button.disabled = false;
    }
}

window.explainTopic = explainTopic;

loadAI();
