import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

// Retrieve API key from environment
const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({ apiKey });
}

// Simulated educational tutor logic for fallback
function generateFallbackResponse(
  message: string,
  level: string,
  subject: string,
  mode: string
): string {
  const normalizedMsg = message.toLowerCase();

  // Mode: QUIZ GENERATOR
  if (mode === "quiz") {
    return `### 🧠 AI Generated Quiz: ${subject || "General Knowledge"} (${level} Level)
Here is a quiz designed just for you. Try to answer these, and I will check your work!

**Question 1 (Multiple Choice):**
What is the primary function of DNA in living organisms?
A) Storing genetic information
B) Generating structural lipids
C) Catalyzing rapid chemical reactions
D) Absorbing solar radiation

**Question 2 (True/False):**
In computer science, a compiler translates source code into machine code before execution, whereas an interpreter translates it line-by-line during execution. (True/False)

**Question 3 (Fill-in-the-blank):**
The equation representing Newton's Second Law of Motion is force equals mass times __________.

*Tip: Type your answers below, and I will grade them for you!*`;
  }

  // Mode: FLASHCARDS
  if (mode === "flashcard") {
    return `### 📇 Flashcard Set: Key Concepts in ${subject || "General Study"}

Here is a study deck customized for a **${level}** learner:

---
**Card 1**
* **Front:** What is the concept of "Time Complexity" in Algorithms?
* **Back:** It is a computational measure that describes the amount of time an algorithm takes to run as a function of the length of the input. Commonly expressed using Big O Notation (e.g., O(n), O(log n)).
---
**Card 2**
* **Front:** Explain "Photosynthesis" in brief.
* **Back:** The biochemical process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water, producing glucose and oxygen as a byproduct.
---
**Card 3**
* **Front:** What is the "Law of Demand" in Economics?
* **Back:** A microeconomic law stating that, all other factors remaining equal, as the price of a good increases, the quantity demanded decreases.

*Want more? Ask me to generate flashcards for any specific topic!*`;
  }

  // Subject: Mathematics
  if (normalizedMsg.includes("solve") || normalizedMsg.includes("math") || normalizedMsg.includes("x") && (normalizedMsg.includes("=") || normalizedMsg.includes("+"))) {
    // Try to extract an equation
    let equation = "2x + 5 = 15";
    if (normalizedMsg.includes("x")) {
      const match = message.match(/[0-9x\s\+\-\*\/\=\(\)]+/);
      if (match) equation = match[0].trim();
    }

    return `### 🔢 Step-by-Step Math Solution: Solving $${equation}$
Let's break down this mathematical problem step-by-step. We will solve it for a **${level}** level understanding.

**Given Equation:**
$$${equation}$$

**Step 1: Isolate the variable term**
To get the term containing $x$ by itself, we need to subtract/add constants from both sides. For our equation $2x + 5 = 15$:
* We subtract $5$ from both sides:
  $$2x + 5 - 5 = 15 - 5$$
  $$2x = 10$$

**Step 2: Solve for the variable $x$**
Now, isolate $x$ by performing the inverse operation. Since $x$ is multiplied by $2$, we divide both sides by $2$:
  $$\\frac{2x}{2} = \\frac{10}{2}$$
  $$x = 5$$

**Step 3: Verify the solution**
Plug $x = 5$ back into our original expression:
  $$2(5) + 5 = 10 + 5 = 15$$
The statement is true, meaning $x = 5$ is correct.

*Does that explanation make sense? Let me know if you'd like another problem!*`;
  }

  // Subject: Programming / Computer Science
  if (normalizedMsg.includes("code") || normalizedMsg.includes("python") || normalizedMsg.includes("javascript") || normalizedMsg.includes("write a function")) {
    return `### 💻 Programming Assistant: Code Implementation & Walkthrough

Here is a clean implementation in Python, complete with detailed logic explanation tailored for a **${level}** developer:

\`\`\`python
def find_factorial(n: int) -> int:
    \"\"\"
    Calculates the factorial of a non-negative integer n using recursion.
    Time Complexity: O(n) | Space Complexity: O(n) call stack depth.
    \"\"\"
    # Base case: 0! or 1! is always 1
    if n <= 1:
        return 1
    
    # Recursive step: n * (n - 1)!
    return n * find_factorial(n - 1)

# Example execution
if __name__ == "__main__":
    number = 5
    result = find_factorial(number)
    print(f"The factorial of {number} is {result}")  # Output: 120
\`\`\`

#### 🔍 Explanation of the logic:
1. **Base Case**: We check if \`n <= 1\`. Without a base case, recursion would run infinitely and cause a stack overflow.
2. **Recursive Call**: The function calls itself with a smaller input, \`n - 1\`.
3. **Unwinding**: Once the base case is hit, the call stack resolves backwards, multiplying the numbers together ($5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$).

*Let me know if you need to translate this code into JavaScript or explain any error!*`;
  }

  // Subject: Science / Chemistry / Physics
  if (normalizedMsg.includes("science") || normalizedMsg.includes("atom") || normalizedMsg.includes("water") || normalizedMsg.includes("gravity") || normalizedMsg.includes("physics")) {
    return `### 🔬 Scientific Concept Explained: Atomic Structure (${level} level)

Let's explore the building blocks of matter: **Atoms**.

**1. The Nucleus (The Core)**
At the very center of an atom lies the nucleus, which contains:
* **Protons**: Subatomic particles with a positive charge ($+$). The number of protons determines the chemical element (atomic number).
* **Neutrons**: Particles with neutral charge. They add stability to the nucleus.

**2. The Electron Cloud (The Orbit)**
Surrounding the nucleus are **Electrons**, which have a negative charge ($-$). They orbit in specific energy shells. In chemical reactions, atoms gain, lose, or share electrons to achieve stability.

**3. Forces at Play**
* **Strong Nuclear Force**: Holds protons and neutrons tightly together in the nucleus, overriding electromagnetic repulsion.
* **Electromagnetic Force**: Keeps the negatively charged electrons orbiting the positively charged nucleus.

*Would you like to study chemical bonding next, or explore quantum mechanical models?*`;
  }

  // Default response
  return `### 🎓 AI Learning Tutor: ${subject || "General Education"}

Welcome! You are studying **${subject || "General Science"}** at a **${level}** difficulty.

Based on your question: *"${message}"*, here is an educational breakdown:

* **Core Concept**: To understand this topic, you should first break it down into primary components: key terms, rules, and structures.
* **Key takeaway**: Consistent active recall and building upon foundational layers is the best way to master this subject.
* **Next recommended study**: You should proceed to look at standard workflows, formulas, or syntax rules related to this.

**How can I assist you further?**
1. Generate practice quizzes on this topic.
2. Formulate flashcards for revision.
3. Solve a practical example.
4. Translate this explanation into another language.`;
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
