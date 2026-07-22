import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with premium courses...");

  // Clean old data
  await prisma.progress.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // Create an Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "laherparesh56@gmail.com",
      name: "Professor Alex",
      passwordHash: "$2a$10$LA.W9nSfw2s/6Up2HlLwwOPDK9gW1dTnaIVYM1eHoWSDVQNrS/vbG", // password is 'laherparesh12345'
      role: "ADMIN",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Professor%20Alex",
      xp: 2500,
      level: 6,
      streak: 5
    }
  });
  console.log("Admin user seeded:", adminUser.email);

  // --- COURSE 1: Web Development ---
  const course1 = await prisma.course.create({
    data: {
      title: "Mastering Modern Web Development",
      description: "Learn how to build responsive, accessible, and fast web applications using HTML, CSS, and modern JavaScript.",
      category: "Web Development",
      difficulty: "BEGINNER",
      imageUrl: "https://images.unsplash.com/photo-1547658719-da2b81169b7b?auto=format&fit=crop&w=800&q=80"
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        title: "Introduction to HTML5 and Semantics",
        content: `### 🌐 Introduction to HTML5
HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. HTML5 is the latest major revision of the HTML standard.

#### Why Semantic Elements Matter?
Semantic elements clearly describe their meaning to both the browser and the developer.
* Non-semantic: \`<div>\` and \`<span>\` - Tells us nothing about its content.
* Semantic: \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, and \`<footer>\` - Clearly defines its content and purpose.

#### Code Example
\`\`\`html
<header>
  <h1>Welcome to AI Learning Hub</h1>
  <nav>
    <a href="/dashboard">Dashboard</a>
  </nav>
</header>
<main>
  <article>
    <h2>Understanding HTML5</h2>
    <p>HTML5 introduces rich API support and structural tags.</p>
  </article>
</main>
\`\`\`
`,
        orderIndex: 1
      },
      {
        courseId: course1.id,
        title: "CSS Layouts: Flexbox and Grid",
        content: `### 🎨 Designing Layouts with Flexbox & Grid
CSS Flexbox and Grid are powerful layout engines that make positioning elements simple and responsive.

#### 1. CSS Flexbox (One-Dimensional)
Best for aligning items in a single row or column.
* \`display: flex;\`
* \`justify-content: center;\` - Aligns along the main axis.
* \`align-items: center;\` - Aligns along the cross axis.

#### 2. CSS Grid (Two-Dimensional)
Best for complex grid layouts containing rows AND columns.
* \`display: grid;\`
* \`grid-template-columns: repeat(3, 1fr);\` - Creates three equal columns.
* \`gap: 1rem;\` - Spacing between cells.
`,
        orderIndex: 2
      }
    ]
  });

  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: "Web Foundations Assessment",
      timeLimit: 300
    }
  });

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        questionText: "Which of the following is a semantic HTML5 element?",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(["div", "span", "header", "font"]),
        correctAnswer: "header"
      },
      {
        quizId: quiz1.id,
        questionText: "CSS Flexbox is primarily designed for two-dimensional layouts (rows and columns simultaneously).",
        type: "TRUE_FALSE",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "False"
      }
    ]
  });

  // --- COURSE 2: Computer Science & Python ---
  const course2 = await prisma.course.create({
    data: {
      title: "Introduction to Python Programming",
      description: "Dive into computer science concepts using Python. Learn variables, conditionals, loops, functions, and basic algorithms.",
      category: "Programming",
      difficulty: "BEGINNER",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course2.id,
        title: "Variables and Control Flow in Python",
        content: `### 🐍 Getting Started with Python
Python is a high-level, interpreted programming language known for its readability.

#### Variables and Data Types
In Python, variables do not require explicit declaration.
\`\`\`python
name = "Sophia"        # String
xp_level = 5           # Integer
is_active = True       # Boolean
skills = ["Math", "CS"] # List
\`\`\`

#### Control Flow (If-Else)
Indentations are syntactically required in Python to define blocks of code.
\`\`\`python
if xp_level > 10:
    print("Welcome Pro User!")
elif xp_level > 0:
    print("Keep studying!")
else:
    print("Let's start learning!")
\`\`\`
`,
        orderIndex: 1
      },
      {
        courseId: course2.id,
        title: "Writing Reusable Functions",
        content: `### 🛠️ Functions in Python
A function is a block of code which only runs when it is called. You can pass data (parameters) into it, and return data back as a result.

#### Defining Functions
Use the \`def\` keyword:
\`\`\`python
def greet_student(name: str, streak: int) -> str:
    return f"Hello {name}! Your current learning streak is {streak} days."

# Invoking the function
msg = greet_student("Alice", 7)
print(msg)
\`\`\`
`,
        orderIndex: 2
      }
    ]
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      courseId: course2.id,
      title: "Python Basics Challenge",
      timeLimit: 240
    }
  });

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz2.id,
        questionText: "How do you define a function in Python?",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(["function myFunc():", "def myFunc():", "func myFunc():", "void myFunc():"]),
        correctAnswer: "def myFunc():"
      },
      {
        quizId: quiz2.id,
        questionText: "Which collection is ordered, changeable, and allows duplicate members in Python?",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(["Set", "Tuple", "Dictionary", "List"]),
        correctAnswer: "List"
      }
    ]
  });

  // --- COURSE 3: Mathematics ---
  const course3 = await prisma.course.create({
    data: {
      title: "Foundations of Algebra",
      description: "Master algebraic equations, systems of equations, variables, and coordinate plotting.",
      category: "Mathematics",
      difficulty: "INTERMEDIATE",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
    }
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course3.id,
        title: "Solving Single Variable Equations",
        content: `### 🔢 Introduction to Linear Equations
An equation is a statement that two mathematical expressions are equal. A linear equation in one variable looks like:
$$ax + b = c$$

#### Steps to Solve
1. **Isolate the constant terms**: Use addition/subtraction.
2. **Isolate the variable term**: Use multiplication/division.

#### Example Walkthrough
Solve for $x$ in:
$$3x - 4 = 11$$

Add $4$ to both sides:
$$3x = 15$$

Divide by $3$:
$$x = 5$$
`,
        orderIndex: 1
      }
    ]
  });

  const quiz3 = await prisma.quiz.create({
    data: {
      courseId: course3.id,
      title: "Linear Equations Checkpoint",
      timeLimit: 180
    }
  });

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz3.id,
        questionText: "Solve for x: 4x + 7 = 19",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(["x = 2", "x = 3", "x = 4", "x = 5"]),
        correctAnswer: "x = 3"
      }
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
