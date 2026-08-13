import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

// Retrieve API key from environment
const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({ apiKey });
}

// Intelligent educational tutor logic for fast dynamic answering
function generateFallbackResponse(
  message: string,
  level: string,
  subject: string,
  mode: string
): string {
  const normalizedMsg = message.trim().toLowerCase();

  // Mode: QUIZ GENERATOR
  if (mode === "quiz" || normalizedMsg.includes("quiz")) {
    return `### 🧠 AI Generated Quiz: ${subject || "General Study"} (${level} Level)

Here is a practice quiz on **"${message}"**. Try to answer these questions!

**Question 1 (Multiple Choice):**
What is the core principle of ${message}?
A) Foundational theory and systematic structure
B) Unrelated random occurrence
C) Temporary physical change only
D) Constant static value

**Question 2 (True/False):**
True or False: Mastering ${message} requires understanding both key concepts and practical application.

**Question 3 (Short Answer):**
Explain in one sentence why ${message} is important in ${subject || "education"}.

*Tip: Reply with your answers and I will evaluate them for you!*`;
  }

  // Mode: FLASHCARDS
  if (mode === "flashcard" || normalizedMsg.includes("flashcard")) {
    return `### 📇 Flashcard Deck: ${message}

**Card 1**
* **Front:** What is the definition of ${message}?
* **Back:** The primary framework and principles defining ${message} in ${subject || "studies"}.

---

**Card 2**
* **Front:** Key Application of ${message}
* **Back:** Used to solve real-world problems and form logical connections in ${subject || "this subject"}.

---

**Card 3**
* **Front:** Core Rule to Remember
* **Back:** Always break ${message} into smaller components: definitions, formulas, and examples.`;
  }

  // Math & Numerical Equations
  if (/[0-9\+\-\*\/\=\^]+/.test(normalizedMsg) && (normalizedMsg.includes("=") || normalizedMsg.includes("+") || normalizedMsg.includes("-") || normalizedMsg.includes("*") || normalizedMsg.includes("/") || normalizedMsg.includes("solve") || normalizedMsg.includes("find"))) {
    // Attempt simple arithmetic calculation
    let evalResult = "";
    try {
      const cleanExpr = message.replace(/[^0-9\+\-\*\/\(\)\.]/g, "");
      if (cleanExpr) {
        const res = Function(`"use strict"; return (${cleanExpr})`)();
        if (typeof res === "number" && !isNaN(res)) {
          evalResult = `\n\n**Direct Answer:** \`${cleanExpr} = ${res}\``;
        }
      }
    } catch (e) {}

    return `### 🔢 Step-by-Step Math Solution: ${message}${evalResult}

Let me break down this math problem step-by-step for a **${level}** level:

**1. Problem Statement:**
$$${message}$$

**2. Step-by-Step Breakdown:**
* **Identify the operations:** Look at the operators (addition, subtraction, multiplication, division, exponents).
* **Apply Order of Operations (PEMDAS/BODMAS):**
  1. Parentheses / Brackets
  2. Exponents / Orders
  3. Multiplication and Division (left to right)
  4. Addition and Subtraction (left to right)
* **Solve systematically:** Perform each operation in sequence to isolate variables or calculate the final value.

*Need another step-by-step calculation? Send me the next problem!*`;
  }

  // Coding & Programming
  if (normalizedMsg.includes("code") || normalizedMsg.includes("python") || normalizedMsg.includes("javascript") || normalizedMsg.includes("html") || normalizedMsg.includes("css") || normalizedMsg.includes("function") || normalizedMsg.includes("program") || normalizedMsg.includes("write")) {
    const lang = normalizedMsg.includes("javascript") || normalizedMsg.includes("js") ? "javascript" : "python";
    return `### 💻 Programming Solution: ${message}

Here is a clean, well-commented code solution in **${lang.toUpperCase()}** for a **${level}** developer:

\`\`\`${lang}
# Code solution for: ${message}

def solve_task(data_input):
    """
    Function to handle: ${message}
    Time Complexity: O(N) | Space Complexity: O(1)
    """
    # 1. Initialize result structure
    results = []
    
    # 2. Process input
    if not data_input:
        return "No data provided"
        
    print(f"Processing topic: {data_input}")
    return f"Successfully processed: {data_input}"

# Example Usage:
if __name__ == "__main__":
    sample = "${message.replace(/"/g, "'")}"
    output = solve_task(sample)
    print(output)
\`\`\`

#### 🔍 Logic Explanation:
1. **Input Validation**: Ensures valid data is received before processing.
2. **Core Algorithm**: Executes the transformation logic with optimal complexity.
3. **Return Value**: Returns structured output ready for display or further processing.

*Want me to convert this code to another language or optimize it further?*`;
  }

  // General Questions & Explanations (Science, History, English, Standard 1-12)
  return `### 🎓 AI Tutor Explanation: ${message}

**Subject:** ${subject || "General Education"} | **Level:** ${level}

---

#### 📌 Overview & Key Concept
**"${message}"** is an important topic in ${subject || "studies"}. Here is a comprehensive, easy-to-understand explanation:

1. **Definition & Meaning:**
   It refers to the fundamental principles, mechanisms, and rules governing this concept. Understanding it helps build strong logical reasoning.

2. **Core Components:**
   - **Foundational Idea:** Start by identifying the primary elements involved.
   - **Practical Application:** Connect the concept to real-world examples and problems.
   - **Key Terminology:** Remember essential definitions and terms associated with it.

3. **Summary & Takeaway:**
   Mastering **${message}** prepares you to tackle advanced questions, exams, and real-life applications in ${subject || "your coursework"}.

---

💡 *What would you like to do next?*
- Type **"quiz"** to test your knowledge on this topic.
- Type **"example"** to see a practical worked-out example.
- Ask any follow-up question!`;
}

// @route   POST /api/tutor/chat
// @desc    Get tutor explanations
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, history, learnerLevel, subject, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const currentLevel = learnerLevel || "INTERMEDIATE";
    const currentSubject = subject || "General Study";
    const currentMode = mode || "normal";

    if (openai) {
      // Create chat context using history and system instruction
      const systemPrompt = `You are "AI Tutor", a highly encouraging, premium, and intelligent educational assistant.
You adapt your explanations for a learner at the ${currentLevel} level.
The current study subject is: ${currentSubject}.
Your interaction mode is: ${currentMode}.

Instructions based on mode:
- "normal": Explain concepts clearly and concisely with markdown formatting, headers, lists, and LaTeX math. Suggest the next logical topic to study.
- "quiz": Generate 3 quiz questions matching the subject and difficulty. Include options and correct answers.
- "flashcard": Generate 3 key flashcards (Front/Back) summarizing key items of the subject.
- "step-by-step": Break down the user's math, science, or code question into clear, numbered logical steps. Use LaTeX equations where applicable.

Keep explanations clear, engaging, and premium. Use code blocks for programming. Use latex double dollar signs for blocks ($$...$$) and single dollar signs for inline ($...$) math equations.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []).map((h: any) => ({
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text
        })),
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1500
      });

      const text = response.choices[0]?.message?.content || "I couldn't generate a response.";
      return res.json({ text, provider: "openai" });
    } else {
      // Fallback local simulation
      const text = generateFallbackResponse(message, currentLevel, currentSubject, currentMode);
      // Add brief delay to simulate network/AI generation
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ text, provider: "simulated-local-ai" });
    }
  } catch (error: any) {
    console.error("AI Tutor Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
