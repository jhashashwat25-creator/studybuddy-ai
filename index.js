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
    "text-generation",
    "onnx-community/Qwen2.5-0.5B-Instruct",
    {
        dtype: "q4",
        device: "webgpu"
    }
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
You are a friendly Python teacher.

Explain this Python concept to a beginner:

${topic}

Your answer must have exactly these sections:

1. Simple Explanation
2. Real-World Analogy
3. Python Example
4. Quick Tip

Use clear, natural English.
Do not repeat the question.
Do not repeat sentences.
Keep the answer under 150 words.
For the Python example, use a small correct code snippet.
`;


        const result = await generator(prompt, {
           max_new_tokens: 220,
temperature: 0.3

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
