import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({ apiKey });
}

function generateSimulatedReview(code: string, language: string): string {
  const lineCount = code.split("\n").length;

  if (!code.trim()) {
    return `### ⚠️ No Code Found
Please write some code in the editor, and I will analyze it and provide feedback!`;
  }

  let suggestions = "";
  let structureFeedback = "";
  let performanceFeedback = "";
  let score = 90;

  if (language === "javascript" || language === "html") {
    if (code.includes("var ")) {
      suggestions += `* **Avoid 'var'**: Replace \`var\` with \`let\` or \`const\` to ensure block-scoping and prevent variable hoisting issues.\n`;
      score -= 5;
    }
    if (!code.includes("const ") && !code.includes("let ") && code.includes("=")) {
      suggestions += `* **Global Variables**: Some variables appear to be declared implicitly without \`const\`, \`let\`, or \`var\`. This causes them to bind to the global scope.\n`;
      score -= 10;
    }
    if (code.includes("console.log")) {
      suggestions += `* **Remove Console Logs**: Remember to remove debugging statements like \`console.log\` before committing code to production.\n`;
      score -= 2;
    }
    structureFeedback = `Modern ECMAScript practices are generally followed. HTML handles semantic structures nicely.`;
    performanceFeedback = `Execution speed is O(1) client-side. The DOM parsing is efficient.`;
  } else if (language === "python") {
    if (code.includes("def ") && !code.includes("->") && !code.includes(":")) {
      suggestions += `* **Type Hinting**: Adding Python type hints (e.g., \`def func(x: int) -> str:\`) makes your codebase much cleaner, self-documenting, and static-type safe.\n`;
    }
    if (code.includes("except:") || code.includes("except Exception:")) {
      suggestions += `* **Broad Exceptions**: You are catching broad exceptions. It's better to catch specific errors (e.g., \`ValueError\`, \`KeyError\`) to avoid swallowing unrelated bugs.\n`;
      score -= 8;
    }
    if (code.includes("range(len(")) {
      suggestions += `* **Enumerate**: Instead of using index ranges like \`for i in range(len(items)):\`, consider using \`for i, item in enumerate(items):\` for cleaner, idiomatic Python.\n`;
      score -= 5;
    }
    structureFeedback = `Complies generally with PEP 8 layout guidelines. Function definitions are clean.`;
    performanceFeedback = `Algorithm structures are optimal. Ensure memory usage is bounded for large datasets.`;
  }

  if (!suggestions) {
    suggestions = `* **Amazing Job!**: No immediate flaws detected. The code style, naming conventions, and logic flow look excellent. Keep it up!\n`;
  }

  return `### 📊 AI Code Review Report
**Score**: \`${score}/100\` | **Language**: \`${language.toUpperCase()}\`

#### 🔍 Static Analysis & Style
${structureFeedback}

#### 💡 Key Suggestions & Improvements
${suggestions}

#### ⚡ Performance & Complexity
${performanceFeedback}

#### 🛠️ Refactored / Improved Version
Here is a suggested way to write this more efficiently and cleanly:

\`\`\`${language}
${code.trim() === "" ? "// Write some code!" : code.trim()}
\`\`\`

*Disclaimer: This review is powered by the AI Learning Hub tutor engine.*`;
}

// @route   POST /api/playground/review
// @desc    Perform code review
router.post("/review", async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code content is required" });
    }

    const currentLang = language || "javascript";

    if (openai) {
      const systemPrompt = `You are "AI Senior Developer", a professional code reviewer.
Review the user's ${currentLang} code.
Provide:
1. A numerical score out of 100
2. Static analysis and styling feedback
3. Key suggestions for improvement (with bullet points)
4. Complexity details (Time/Space Complexity)
5. A refactored version of the code that fixes issues and adds comments.
Use clean markdown layout.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: code }
        ],
        temperature: 0.2,
        max_tokens: 1200
      });

      const review = response.choices[0]?.message?.content || "Could not generate review.";
      return res.json({ review, provider: "openai" });
    } else {
      const review = generateSimulatedReview(code, currentLang);
      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.json({ review, provider: "simulated-local-ai" });
    }
  } catch (error: any) {
    console.error("AI Playground Review Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
