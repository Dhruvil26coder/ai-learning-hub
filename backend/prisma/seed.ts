import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const curriculumData = [
  {
    id: 1,
    name: "Class 1",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Numbers 1 to 100", summary: "Learn counting, reading and writing numbers from 1 to 100. Understand place values of tens and ones.", videoUrl: "https://www.youtube.com/embed/7NvZ6_4X3CQ", keyConcepts: '["Counting", "Tens and Ones", "Number Names", "Ordering Numbers"]' },
          { title: "Addition", summary: "Learn basic addition of single and double digit numbers using objects and number lines.", videoUrl: "https://www.youtube.com/embed/AuX7nPBqDts", keyConcepts: '["Adding Numbers", "Number Line", "Sum", "Plus Sign"]' },
          { title: "Subtraction", summary: "Learn to subtract smaller numbers from larger numbers using fun objects and pictures.", videoUrl: "https://www.youtube.com/embed/vO3bm37KZWU", keyConcepts: '["Take Away", "Minus Sign", "Difference", "Counting Back"]' },
          { title: "Shapes", summary: "Identify and name basic 2D and 3D shapes like circle, square, triangle, rectangle, sphere and cube.", videoUrl: "https://www.youtube.com/embed/E_mTbN3Qv6w", keyConcepts: '["Circle", "Square", "Triangle", "Rectangle", "2D Shapes"]' },
        ]
      },
      {
        name: "English",
        icon: "📖",
        color: "green",
        chapters: [
          { title: "Alphabets A to Z", summary: "Learn all 26 alphabets in uppercase and lowercase with pronunciation and words.", videoUrl: "https://www.youtube.com/embed/hq3yfQnllfQ", keyConcepts: '["Uppercase Letters", "Lowercase Letters", "Vowels", "Consonants"]' },
          { title: "Vowels and Consonants", summary: "Understand the difference between vowels (A,E,I,O,U) and consonants with examples.", videoUrl: "https://www.youtube.com/embed/bfh2kFiXXpQ", keyConcepts: '["Vowels", "Consonants", "A E I O U", "Letter Sounds"]' },
          { title: "Simple Words", summary: "Learn 3-letter and 4-letter simple English words through pictures and rhymes.", videoUrl: "https://www.youtube.com/embed/HGBTkdxeNNE", keyConcepts: '["CVC Words", "Word Reading", "Spelling", "Phonics"]' },
        ]
      },
      {
        name: "Environmental Studies",
        icon: "🌿",
        color: "emerald",
        chapters: [
          { title: "My Family", summary: "Learn about family members, their roles and how families live together.", videoUrl: "https://www.youtube.com/embed/7k3GJqLHRRQ", keyConcepts: '["Family Members", "Mother", "Father", "Siblings", "Grandparents"]' },
          { title: "Our Body", summary: "Learn the names and functions of body parts like eyes, ears, nose, hands and legs.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Body Parts", "Senses", "Eyes", "Ears", "Nose", "Hands"]' },
          { title: "Plants Around Us", summary: "Identify plants, trees, flowers and learn their importance in our life.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Trees", "Plants", "Flowers", "Leaves", "Roots"]' },
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Class 2",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Numbers up to 1000", summary: "Understand hundreds, tens and ones. Read and write numbers up to 1000.", videoUrl: "https://www.youtube.com/embed/3OAzFMalOX8", keyConcepts: '["Hundreds", "Tens", "Ones", "Place Value", "Expanded Form"]' },
          { title: "Addition with Carrying", summary: "Learn to add two and three digit numbers with carrying (regrouping).", videoUrl: "https://www.youtube.com/embed/3OAzFMalOX8", keyConcepts: '["Carrying", "Regrouping", "Column Addition", "Sum"]' },
          { title: "Subtraction with Borrowing", summary: "Subtract numbers with borrowing from tens and hundreds place.", videoUrl: "https://www.youtube.com/embed/vO3bm37KZWU", keyConcepts: '["Borrowing", "Regrouping", "Difference", "Column Subtraction"]' },
          { title: "Multiplication Tables (1-5)", summary: "Learn multiplication tables from 1 to 5 through songs and patterns.", videoUrl: "https://www.youtube.com/embed/Mso0GMFRtS8", keyConcepts: '["Times Tables", "Multiplication", "Groups Of", "Product"]' },
          { title: "Measurement - Length", summary: "Measure objects using centimetres and metres. Compare lengths.", videoUrl: "https://www.youtube.com/embed/TsedRNjWPSY", keyConcepts: '["Centimetre", "Metre", "Ruler", "Comparing Lengths"]' },
        ]
      },
      {
        name: "English",
        icon: "📖",
        color: "green",
        chapters: [
          { title: "Nouns", summary: "Learn what nouns are - names of people, places, animals and things.", videoUrl: "https://www.youtube.com/embed/6GZpFmRAqbI", keyConcepts: '["Nouns", "Common Noun", "Proper Noun", "Names", "Places"]' },
          { title: "Verbs", summary: "Learn action words (verbs) and how they describe what people or things do.", videoUrl: "https://www.youtube.com/embed/rpxlPpbFE_M", keyConcepts: '["Verbs", "Action Words", "Run", "Jump", "Eat", "Sleep"]' },
          { title: "Simple Sentences", summary: "Build simple sentences with subjects and predicates. Learn sentence structure.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Subject", "Predicate", "Sentence", "Capital Letter", "Full Stop"]' },
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Class 3",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "4-Digit Numbers", summary: "Read, write and compare 4-digit numbers. Understand thousands place value.", videoUrl: "https://www.youtube.com/embed/3OAzFMalOX8", keyConcepts: '["Thousands", "Hundreds", "Place Value", "Comparing Numbers"]' },
          { title: "Multiplication (6-10 Tables)", summary: "Master multiplication tables from 6 to 10 with tricks and patterns.", videoUrl: "https://www.youtube.com/embed/Mso0GMFRtS8", keyConcepts: '["Times Tables", "6-10 Tables", "Multiplication Facts", "Product"]' },
          { title: "Division", summary: "Understand division as equal sharing and grouping. Learn basic division facts.", videoUrl: "https://www.youtube.com/embed/L9rCCEJmIgU", keyConcepts: '["Division", "Equal Sharing", "Quotient", "Remainder", "Divisor"]' },
          { title: "Fractions", summary: "Introduction to fractions - halves, thirds and quarters with pictures.", videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", keyConcepts: '["Half", "Quarter", "Numerator", "Denominator", "Equal Parts"]' },
          { title: "Time", summary: "Read time on a clock, understand hours, minutes and the calendar.", videoUrl: "https://www.youtube.com/embed/DjuadCjsEoE", keyConcepts: '["Hours", "Minutes", "Analogue Clock", "Digital Clock", "Calendar"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "Plants - Parts and Functions", summary: "Learn the parts of a plant - roots, stem, leaves, flowers and fruits and their functions.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Roots", "Stem", "Leaves", "Photosynthesis", "Flowers", "Fruits"]' },
          { title: "Animals", summary: "Classify animals by their habitat, food habits and body coverings.", videoUrl: "https://www.youtube.com/embed/7k3GJqLHRRQ", keyConcepts: '["Herbivores", "Carnivores", "Omnivores", "Habitat", "Body Coverings"]' },
          { title: "Food and Nutrition", summary: "Learn about different food groups, balanced diet and importance of nutrition.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Carbohydrates", "Proteins", "Vitamins", "Minerals", "Balanced Diet"]' },
        ]
      },
      {
        name: "English",
        icon: "📖",
        color: "green",
        chapters: [
          { title: "Adjectives", summary: "Learn describing words (adjectives) that tell us more about nouns.", videoUrl: "https://www.youtube.com/embed/NKmQFbHdaos", keyConcepts: '["Adjectives", "Describing Words", "Size", "Colour", "Shape"]' },
          { title: "Tenses - Present and Past", summary: "Understand present and past tense and how to change verb forms.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Present Tense", "Past Tense", "Verb Forms", "Was/Were", "Is/Are"]' },
          { title: "Punctuation", summary: "Learn full stops, commas, question marks and exclamation marks.", videoUrl: "https://www.youtube.com/embed/nBEczNMbLcE", keyConcepts: '["Full Stop", "Comma", "Question Mark", "Exclamation Mark", "Apostrophe"]' },
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Class 4",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Large Numbers (5 & 6 Digits)", summary: "Read and write 5 and 6 digit numbers. Understand lakh place value.", videoUrl: "https://www.youtube.com/embed/3OAzFMalOX8", keyConcepts: '["Ten Thousands", "Lakhs", "Place Value", "Indian Numbering"]' },
          { title: "Factors and Multiples", summary: "Learn factors, multiples, LCM and HCF with examples and problems.", videoUrl: "https://www.youtube.com/embed/Q7JdVOQJNoc", keyConcepts: '["Factors", "Multiples", "LCM", "HCF", "Prime Numbers"]' },
          { title: "Fractions and Decimals", summary: "Add, subtract and compare fractions. Introduction to decimal numbers.", videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", keyConcepts: '["Like Fractions", "Unlike Fractions", "Decimals", "Tenths", "Hundredths"]' },
          { title: "Geometry - Angles", summary: "Learn about angles - acute, obtuse, right angle and straight angle.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Angle", "Right Angle", "Acute", "Obtuse", "Protractor"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "States of Matter", summary: "Learn about solids, liquids and gases and their properties.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Solid", "Liquid", "Gas", "Properties", "Melting", "Evaporation"]' },
          { title: "Light and Shadow", summary: "Understand how light travels, forms shadows and the concept of transparent and opaque objects.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Light", "Shadow", "Transparent", "Opaque", "Reflection"]' },
          { title: "Human Digestive System", summary: "Learn how our body digests food from mouth to intestines.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Mouth", "Stomach", "Intestines", "Digestion", "Nutrients"]' },
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Class 5",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Large Numbers and Operations", summary: "Work with numbers up to crores. Operations on large numbers.", videoUrl: "https://www.youtube.com/embed/3OAzFMalOX8", keyConcepts: '["Crores", "Indian System", "International System", "Place Value"]' },
          { title: "Average", summary: "Learn to calculate average and understand its real-life applications.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Average", "Mean", "Sum", "Divide", "Data"]' },
          { title: "Percentage", summary: "Introduction to percentages and converting fractions to percentages.", videoUrl: "https://www.youtube.com/embed/JeVSmq1Nrpw", keyConcepts: '["Percent", "Per Hundred", "Fraction to Percent", "Discount"]' },
          { title: "Area and Perimeter", summary: "Calculate area and perimeter of squares, rectangles and triangles.", videoUrl: "https://www.youtube.com/embed/TsedRNjWPSY", keyConcepts: '["Perimeter", "Area", "Square", "Rectangle", "Formula"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "Living and Non-living Things", summary: "Differences between living and non-living things and characteristics of life.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Characteristics of Life", "Living", "Non-living", "Growth", "Reproduction"]' },
          { title: "The Nervous System", summary: "Learn about the brain, spinal cord, nerves and how our body sends signals.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Brain", "Spinal Cord", "Nerves", "Neurons", "Senses"]' },
          { title: "Simple Machines", summary: "Understand levers, pulleys, wheels and inclined planes as simple machines.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Lever", "Pulley", "Wheel", "Inclined Plane", "Force", "Work"]' },
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Class 6",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Integers", summary: "Introduction to negative numbers and integers on a number line.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Negative Numbers", "Integers", "Number Line", "Absolute Value"]' },
          { title: "Fractions and Decimals", summary: "Operations on fractions and decimals including multiplication and division.", videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw", keyConcepts: '["Fractions", "Decimals", "Multiplication", "Division", "Simplification"]' },
          { title: "Algebra - Introduction", summary: "Introduction to variables, expressions and simple equations.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Variable", "Expression", "Equation", "Constant", "Coefficient"]' },
          { title: "Ratio and Proportion", summary: "Understand ratio, proportion and their applications in everyday life.", videoUrl: "https://www.youtube.com/embed/JeVSmq1Nrpw", keyConcepts: '["Ratio", "Proportion", "Unitary Method", "Direct Proportion"]' },
          { title: "Basic Geometry", summary: "Lines, angles, triangles, quadrilaterals and their properties.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Line", "Ray", "Angle", "Triangle", "Quadrilateral"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "Food: Where Does it Come From?", summary: "Identify food sources from plants and animals. Understand food chains.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Food Sources", "Plants", "Animals", "Food Chain", "Producers"]' },
          { title: "Fibre to Fabric", summary: "Learn how fibres are obtained and processed into fabric and clothing.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Fibre", "Fabric", "Spinning", "Weaving", "Cotton", "Wool"]' },
          { title: "Changes Around Us", summary: "Understand reversible and irreversible changes with examples.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Reversible", "Irreversible", "Physical Change", "Chemical Change"]' },
          { title: "The Living World", summary: "Classification of living organisms into kingdoms with examples.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Kingdom", "Monera", "Fungi", "Plantae", "Animalia", "Classification"]' },
        ]
      },
      {
        name: "Social Studies",
        icon: "🌍",
        color: "orange",
        chapters: [
          { title: "The Earth and its Movements", summary: "Rotation and revolution of the Earth and their effects - day/night and seasons.", videoUrl: "https://www.youtube.com/embed/7NvZ6_4X3CQ", keyConcepts: '["Rotation", "Revolution", "Day and Night", "Seasons", "Axis"]' },
          { title: "Latitudes and Longitudes", summary: "Understand the grid system of latitude and longitude on maps and globes.", videoUrl: "https://www.youtube.com/embed/swKBi3hme0Q", keyConcepts: '["Latitude", "Longitude", "Equator", "Prime Meridian", "Grid", "Coordinates"]' },
          { title: "Major Landforms", summary: "Mountains, plateaus, plains and their formation and importance.", videoUrl: "https://www.youtube.com/embed/swKBi3hme0Q", keyConcepts: '["Mountains", "Plateaus", "Plains", "Valleys", "Landforms"]' },
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Class 7",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Integers - Advanced", summary: "Operations on integers including multiplication and division of negative numbers.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Integer Operations", "Negative × Negative", "Number Line", "Properties"]' },
          { title: "Simple Equations", summary: "Solve simple linear equations in one variable using balancing method.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Linear Equation", "Variable", "Balancing", "Solution", "Transposing"]' },
          { title: "Lines and Angles", summary: "Supplementary, complementary, vertically opposite and alternate angles.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Supplementary", "Complementary", "Parallel Lines", "Transversal", "Alternate Angles"]' },
          { title: "Triangles and Properties", summary: "Properties of triangles, Pythagoras theorem and types of triangles.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Triangle", "Pythagoras", "Equilateral", "Isosceles", "Scalene"]' },
          { title: "Data Handling", summary: "Collect, organize and represent data using bar graphs, pie charts and histograms.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Bar Graph", "Pie Chart", "Mean", "Median", "Mode", "Data"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "Nutrition in Plants", summary: "How plants prepare their own food through photosynthesis.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Photosynthesis", "Chlorophyll", "Carbon Dioxide", "Glucose", "Autotrophs"]' },
          { title: "Heat", summary: "Transfer of heat by conduction, convection and radiation with examples.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Conduction", "Convection", "Radiation", "Temperature", "Thermometer"]' },
          { title: "Acids, Bases and Salts", summary: "Properties of acids and bases. Indicators and neutralization reactions.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Acid", "Base", "Salt", "Indicator", "pH", "Neutralization"]' },
          { title: "Motion and Time", summary: "Understand speed, distance, time and represent motion on graphs.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Speed", "Distance", "Time", "Motion", "Distance-Time Graph"]' },
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Class 8",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Rational Numbers", summary: "Operations on rational numbers - addition, subtraction, multiplication and division.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Rational Numbers", "Number Line", "Additive Inverse", "Properties"]' },
          { title: "Algebraic Expressions", summary: "Addition, subtraction and multiplication of algebraic expressions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Polynomial", "Monomial", "Binomial", "Like Terms", "Factorisation"]' },
          { title: "Squares and Square Roots", summary: "Perfect squares, square roots and finding square roots by division method.", videoUrl: "https://www.youtube.com/embed/Q7JdVOQJNoc", keyConcepts: '["Perfect Square", "Square Root", "Long Division", "Pythagorean Triplets"]' },
          { title: "Linear Equations in Two Variables", summary: "Solve and graph linear equations in two variables.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Two Variables", "Graph", "Solution", "Intersection", "Slope"]' },
          { title: "Mensuration", summary: "Area and perimeter of quadrilaterals, surface area and volume of solids.", videoUrl: "https://www.youtube.com/embed/TsedRNjWPSY", keyConcepts: '["Surface Area", "Volume", "Cylinder", "Cone", "Sphere"]' },
        ]
      },
      {
        name: "Science",
        icon: "🔬",
        color: "purple",
        chapters: [
          { title: "Crop Production and Management", summary: "Agricultural practices, irrigation, crop protection and storage of food grains.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Kharif", "Rabi", "Irrigation", "Fertiliser", "Pesticide", "Harvesting"]' },
          { title: "Cell - Structure and Functions", summary: "Discover the basic unit of life - the cell and its organelles and functions.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Cell", "Nucleus", "Mitochondria", "Cell Membrane", "Cell Wall", "Organelles"]' },
          { title: "Force and Pressure", summary: "Effects of force, types of pressure and atmospheric pressure.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Force", "Pressure", "Friction", "Atmospheric Pressure", "Buoyancy"]' },
          { title: "Light", summary: "Laws of reflection, refraction, lenses and human eye.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Reflection", "Refraction", "Lens", "Dispersion", "Rainbow", "Human Eye"]' },
        ]
      }
    ]
  },
  {
    id: 9,
    name: "Class 9",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Number Systems", summary: "Rational, irrational and real numbers. Representation on number line. Laws of exponents.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Irrational Numbers", "Real Numbers", "Surds", "Laws of Exponents"]' },
          { title: "Polynomials", summary: "Degree of polynomials, zeros, remainder theorem and factor theorem.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Polynomial", "Zero", "Remainder Theorem", "Factor Theorem", "Algebraic Identities"]' },
          { title: "Coordinate Geometry", summary: "Cartesian plane, plotting points and distance formula.", videoUrl: "https://www.youtube.com/embed/swKBi3hme0Q", keyConcepts: '["Cartesian Plane", "X-axis", "Y-axis", "Quadrants", "Distance Formula"]' },
          { title: "Linear Equations", summary: "Linear equations in two variables, graph and solutions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Linear Equation", "Graph", "Solution", "Intercepts", "Slope"]' },
          { title: "Triangles", summary: "Congruence of triangles, SAS, SSS, ASA, AAS and RHS rules.", videoUrl: "https://www.youtube.com/embed/bYzNlNEjSCQ", keyConcepts: '["Congruence", "SAS", "SSS", "ASA", "RHS", "CPCT"]' },
          { title: "Statistics", summary: "Mean, median, mode and representation of data with frequency distribution.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Mean", "Median", "Mode", "Frequency Distribution", "Histogram"]' },
        ]
      },
      {
        name: "Science - Physics",
        icon: "⚡",
        color: "yellow",
        chapters: [
          { title: "Motion", summary: "Uniform and non-uniform motion, equations of motion and graphical representation.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Displacement", "Velocity", "Acceleration", "Equations of Motion", "Graphs"]' },
          { title: "Force and Laws of Motion", summary: "Newton\'s three laws of motion, momentum and conservation of momentum.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Newton\'s Laws", "Inertia", "Momentum", "Action-Reaction", "Conservation"]' },
          { title: "Gravitation", summary: "Universal law of gravitation, free fall, mass vs weight and pressure.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Gravitation", "G", "Free Fall", "Weight", "Buoyancy", "Archimedes Principle"]' },
          { title: "Work and Energy", summary: "Work done by a force, kinetic and potential energy, law of conservation of energy.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Work", "Kinetic Energy", "Potential Energy", "Conservation of Energy", "Power"]' },
        ]
      },
      {
        name: "Science - Chemistry",
        icon: "🧪",
        color: "red",
        chapters: [
          { title: "Matter in Our Surroundings", summary: "States of matter, properties, interconversion and effect of temperature and pressure.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Solid", "Liquid", "Gas", "Plasma", "Latent Heat", "Sublimation"]' },
          { title: "Is Matter Around Us Pure?", summary: "Mixtures, solutions, colloids and separation techniques.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Mixture", "Solution", "Colloid", "Suspension", "Distillation", "Chromatography"]' },
          { title: "Atoms and Molecules", summary: "Atomic theory, laws of chemical combination, atomic mass and molecular formula.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Atom", "Molecule", "Atomic Mass", "Mole", "Avogadro\'s Number"]' },
        ]
      },
      {
        name: "Science - Biology",
        icon: "🧬",
        color: "teal",
        chapters: [
          { title: "Cell - Fundamental Unit of Life", summary: "Cell theory, types of cells, organelles and their functions.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Prokaryotic", "Eukaryotic", "Organelles", "Nucleus", "Mitochondria", "Chloroplast"]' },
          { title: "Tissues", summary: "Animal and plant tissues, their types, structure and functions.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Epithelial Tissue", "Connective Tissue", "Meristematic Tissue", "Permanent Tissue"]' },
          { title: "Diversity in Living Organisms", summary: "Five kingdom classification and major characteristics of each kingdom.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Classification", "Nomenclature", "Monera", "Fungi", "Plantae", "Animalia"]' },
        ]
      }
    ]
  },
  {
    id: 10,
    name: "Class 10",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Real Numbers", summary: "Euclid\'s division lemma, fundamental theorem of arithmetic, irrational numbers.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Euclid\'s Lemma", "HCF", "LCM", "Irrational Numbers", "Decimal Expansions"]' },
          { title: "Polynomials", summary: "Zeros of polynomials, relationship between zeros and coefficients, division algorithm.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Zeros", "Coefficients", "Division Algorithm", "Quadratic", "Cubic"]' },
          { title: "Quadratic Equations", summary: "Solve by factoring, completing the square and quadratic formula. Discriminant.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Quadratic Formula", "Discriminant", "Roots", "Factorisation", "Completing Square"]' },
          { title: "Arithmetic Progression", summary: "General term, sum of AP and applications of arithmetic progressions.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["AP", "Common Difference", "nth Term", "Sum of n Terms", "Arithmetic Mean"]' },
          { title: "Trigonometry", summary: "Trigonometric ratios, identities, angles of elevation and depression.", videoUrl: "https://www.youtube.com/embed/F21S9Wpi0y8", keyConcepts: '["sin", "cos", "tan", "Identities", "Elevation", "Depression", "Pythagoras"]' },
          { title: "Coordinate Geometry", summary: "Distance formula, section formula, area of triangle using coordinates.", videoUrl: "https://www.youtube.com/embed/swKBi3hme0Q", keyConcepts: '["Distance Formula", "Section Formula", "Midpoint", "Area of Triangle"]' },
          { title: "Surface Areas and Volumes", summary: "Surface area and volume of combinations of solids - cylinder, cone, sphere, frustum.", videoUrl: "https://www.youtube.com/embed/TsedRNjWPSY", keyConcepts: '["Cylinder", "Cone", "Sphere", "Frustum", "Surface Area", "Volume"]' },
          { title: "Statistics and Probability", summary: "Mean, median, mode of grouped data. Basic probability and its calculations.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Mean", "Median", "Mode", "Probability", "Cumulative Frequency"]' },
        ]
      },
      {
        name: "Science - Physics",
        icon: "⚡",
        color: "yellow",
        chapters: [
          { title: "Electricity", summary: "Electric current, Ohm\'s law, resistance, series and parallel circuits and power.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Current", "Voltage", "Resistance", "Ohm\'s Law", "Series", "Parallel", "Power"]' },
          { title: "Magnetic Effects of Current", summary: "Magnetic field due to current, electromagnetic induction and electric motor.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Magnetic Field", "Solenoid", "Electromagnet", "Motor", "Generator", "Faraday"]' },
          { title: "Light - Reflection and Refraction", summary: "Laws of reflection and refraction, mirrors and lenses, power of a lens.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Reflection", "Refraction", "Concave Mirror", "Convex Lens", "Focal Length", "Power"]' },
        ]
      },
      {
        name: "Science - Chemistry",
        icon: "🧪",
        color: "red",
        chapters: [
          { title: "Chemical Reactions and Equations", summary: "Types of chemical reactions, balancing equations and oxidation-reduction.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Chemical Equation", "Balancing", "Combination", "Decomposition", "Redox"]' },
          { title: "Acids, Bases and Salts", summary: "Properties of acids and bases, pH scale, salts and their preparation.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["pH Scale", "Indicator", "Neutralisation", "Salt", "Bleaching Powder", "Baking Soda"]' },
          { title: "Metals and Non-metals", summary: "Physical and chemical properties of metals and non-metals. Reactivity series.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Metals", "Non-metals", "Reactivity Series", "Corrosion", "Alloys"]' },
          { title: "Carbon and its Compounds", summary: "Covalent bonding in carbon, homologous series, nomenclature and functional groups.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Covalent Bond", "Carbon", "Alkane", "Alkene", "Functional Groups", "IUPAC"]' },
        ]
      },
      {
        name: "Science - Biology",
        icon: "🧬",
        color: "teal",
        chapters: [
          { title: "Life Processes", summary: "Nutrition, respiration, transportation and excretion in plants and animals.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Nutrition", "Respiration", "Transportation", "Excretion", "Photosynthesis"]' },
          { title: "Control and Coordination", summary: "Nervous system, hormones and their role in coordination.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Neurons", "Reflex Arc", "Brain", "Hormones", "Endocrine System"]' },
          { title: "Heredity and Evolution", summary: "Mendel\'s laws, sex determination, evolution and natural selection.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Heredity", "DNA", "Mendel\'s Laws", "Dominant", "Recessive", "Evolution"]' },
        ]
      }
    ]
  },
  {
    id: 11,
    name: "Class 11",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Sets", summary: "Types of sets, operations on sets, Venn diagrams and applications.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Sets", "Union", "Intersection", "Complement", "Venn Diagram"]' },
          { title: "Functions and Relations", summary: "Domain, range, types of functions and composite functions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Function", "Domain", "Range", "One-One", "Onto", "Composite"]' },
          { title: "Trigonometry", summary: "Trigonometric functions, their graphs, identities and inverse functions.", videoUrl: "https://www.youtube.com/embed/F21S9Wpi0y8", keyConcepts: '["Radians", "Sine", "Cosine", "Identities", "Graphs", "Inverse Trig"]' },
          { title: "Complex Numbers", summary: "Imaginary numbers, modulus, argument, polar form and De Moivre\'s theorem.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Imaginary Unit", "Modulus", "Argument", "Polar Form", "Conjugate"]' },
          { title: "Permutations and Combinations", summary: "Fundamental counting principle, permutations and combinations with applications.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Factorial", "Permutation", "Combination", "nPr", "nCr"]' },
          { title: "Limits and Derivatives", summary: "Concept of limit, standard limits and differentiation of polynomial functions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Limit", "Derivative", "Differentiation", "Chain Rule", "Product Rule"]' },
        ]
      },
      {
        name: "Physics",
        icon: "⚡",
        color: "yellow",
        chapters: [
          { title: "Units and Measurements", summary: "SI units, dimensional analysis, significant figures and errors in measurement.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["SI Units", "Dimensional Analysis", "Significant Figures", "Error", "Accuracy"]' },
          { title: "Kinematics", summary: "Motion in a straight line, projectile motion and circular motion.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Displacement", "Velocity", "Acceleration", "Projectile", "Circular Motion"]' },
          { title: "Laws of Motion", summary: "Newton\'s laws, friction, circular motion dynamics and centripetal force.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Newton\'s Laws", "Friction", "Centripetal Force", "Momentum", "Impulse"]' },
          { title: "Work, Energy and Power", summary: "Work-energy theorem, conservative forces, potential energy and power.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Work-Energy Theorem", "Conservative Force", "Potential Energy", "Power", "Elastic Collision"]' },
          { title: "Thermodynamics", summary: "Zeroth, first and second law of thermodynamics, heat engines and entropy.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Thermodynamics Laws", "Internal Energy", "Entropy", "Heat Engine", "Carnot Cycle"]' },
        ]
      },
      {
        name: "Chemistry",
        icon: "🧪",
        color: "red",
        chapters: [
          { title: "Some Basic Concepts", summary: "Mole concept, stoichiometry, empirical and molecular formula.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Mole", "Avogadro Number", "Stoichiometry", "Empirical Formula", "Molarity"]' },
          { title: "Atomic Structure", summary: "Bohr\'s model, quantum mechanical model, orbitals and electronic configuration.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Bohr Model", "Quantum Numbers", "Orbitals", "Electronic Configuration", "Aufbau"]' },
          { title: "Chemical Bonding", summary: "Ionic, covalent, metallic bonding, VSEPR theory and hybridisation.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Ionic Bond", "Covalent Bond", "VSEPR", "Hybridisation", "Molecular Geometry"]' },
          { title: "Equilibrium", summary: "Chemical equilibrium, Le Chatelier\'s principle, acids, bases and buffers.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Equilibrium Constant", "Le Chatelier", "pH", "Buffer Solution", "Ksp"]' },
        ]
      },
      {
        name: "Biology",
        icon: "🧬",
        color: "teal",
        chapters: [
          { title: "Cell Biology", summary: "Cell theory, cell structure, cell cycle, mitosis and meiosis.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Cell Cycle", "Mitosis", "Meiosis", "DNA Replication", "Chromatin"]' },
          { title: "Biomolecules", summary: "Carbohydrates, proteins, lipids, nucleic acids and enzymes.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Carbohydrates", "Proteins", "Lipids", "Nucleic Acids", "Enzymes", "Metabolism"]' },
          { title: "Plant Kingdom", summary: "Classification of plants - algae, bryophytes, pteridophytes, gymnosperms and angiosperms.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms"]' },
        ]
      }
    ]
  },
  {
    id: 12,
    name: "Class 12",
    subjects: [
      {
        name: "Mathematics",
        icon: "🔢",
        color: "blue",
        chapters: [
          { title: "Relations and Functions", summary: "Equivalence relations, bijective functions, binary operations and inverse functions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Equivalence Relation", "Bijection", "Inverse Function", "Binary Operation"]' },
          { title: "Inverse Trigonometry", summary: "Principal value, domain and range of inverse trig functions and identities.", videoUrl: "https://www.youtube.com/embed/F21S9Wpi0y8", keyConcepts: '["arcsin", "arccos", "arctan", "Principal Value", "Identities"]' },
          { title: "Matrices and Determinants", summary: "Operations on matrices, types of matrices, determinants and their properties.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Matrix", "Determinant", "Transpose", "Adjoint", "Inverse", "Cramer\'s Rule"]' },
          { title: "Continuity and Differentiability", summary: "Continuity, differentiability, chain rule and implicit differentiation.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Continuity", "Differentiability", "Chain Rule", "Logarithmic Differentiation"]' },
          { title: "Integrals", summary: "Indefinite and definite integrals, integration by parts, substitution and partial fractions.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Integration", "Substitution", "By Parts", "Definite Integral", "Area"]' },
          { title: "Differential Equations", summary: "Order and degree, variable separable, homogeneous and linear differential equations.", videoUrl: "https://www.youtube.com/embed/BZnt6tBgIBo", keyConcepts: '["Order", "Degree", "Separable", "Homogeneous", "Linear DE", "Integrating Factor"]' },
          { title: "Probability", summary: "Conditional probability, Bayes\' theorem, random variables and probability distributions.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Conditional Probability", "Bayes\' Theorem", "Random Variable", "Binomial Distribution"]' },
          { title: "Linear Programming", summary: "Graphical method of solving linear programming problems and applications.", videoUrl: "https://www.youtube.com/embed/4bHVqRkf5Ak", keyConcepts: '["Feasible Region", "Objective Function", "Corner Points", "Optimal Solution"]' },
        ]
      },
      {
        name: "Physics",
        icon: "⚡",
        color: "yellow",
        chapters: [
          { title: "Electrostatics", summary: "Coulomb\'s law, electric field, potential, capacitance and dielectrics.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Coulomb\'s Law", "Electric Field", "Electric Potential", "Capacitance", "Gauss Law"]' },
          { title: "Current Electricity", summary: "Drift velocity, Ohm\'s law, Kirchhoff\'s rules and Wheatstone bridge.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Drift Velocity", "Kirchhoff\'s Laws", "Wheatstone Bridge", "Potentiometer"]' },
          { title: "Electromagnetic Induction", summary: "Faraday\'s and Lenz\'s laws, self and mutual inductance, AC circuits.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Faraday\'s Law", "Lenz\'s Law", "Inductance", "AC Circuits", "Transformer"]' },
          { title: "Optics", summary: "Ray optics, wave optics, interference, diffraction and polarisation.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Refraction", "Interference", "Diffraction", "Polarisation", "Young\'s Experiment"]' },
          { title: "Modern Physics", summary: "Dual nature of matter, photoelectric effect, atoms, nuclei and semiconductors.", videoUrl: "https://www.youtube.com/embed/PXOhOBNt2z8", keyConcepts: '["Photoelectric Effect", "de Broglie", "Radioactivity", "Nuclear Fission", "Semiconductors"]' },
        ]
      },
      {
        name: "Chemistry",
        icon: "🧪",
        color: "red",
        chapters: [
          { title: "Solid State", summary: "Types of solids, crystal structures, imperfections and electrical properties.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Crystal Lattice", "Unit Cell", "BCC", "FCC", "Defects", "Semiconductors"]' },
          { title: "Electrochemistry", summary: "Galvanic cells, electrode potential, Nernst equation, electrolysis and corrosion.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Galvanic Cell", "EMF", "Nernst Equation", "Electrolysis", "Faraday\'s Laws"]' },
          { title: "Chemical Kinetics", summary: "Rate of reaction, rate law, order, activation energy and Arrhenius equation.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["Rate Law", "Order", "Activation Energy", "Arrhenius Equation", "Half Life"]' },
          { title: "Organic Chemistry", summary: "Mechanisms, named reactions, polymers, biomolecules and chemistry in everyday life.", videoUrl: "https://www.youtube.com/embed/rz9AuMKJiRo", keyConcepts: '["SN1", "SN2", "Elimination", "Polymers", "Biomolecules", "Named Reactions"]' },
        ]
      },
      {
        name: "Biology",
        icon: "🧬",
        color: "teal",
        chapters: [
          { title: "Reproduction", summary: "Sexual and asexual reproduction in plants and animals, human reproductive system.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Sexual Reproduction", "Asexual", "Fertilisation", "Embryo", "Seed", "Pollination"]' },
          { title: "Genetics and Evolution", summary: "Mendel\'s laws, chromosomal theory, mutation, genetic disorders and evolution.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Mendel", "Chromosomes", "Mutation", "Natural Selection", "Hardy-Weinberg"]' },
          { title: "Biotechnology", summary: "Recombinant DNA technology, cloning, PCR, transgenic organisms and applications.", videoUrl: "https://www.youtube.com/embed/YE9bEzCFffs", keyConcepts: '["Recombinant DNA", "PCR", "Gel Electrophoresis", "Cloning", "GMO"]' },
          { title: "Ecology", summary: "Ecosystems, food webs, energy flow, biogeochemical cycles and biodiversity.", videoUrl: "https://www.youtube.com/embed/2_0ZXd9smE0", keyConcepts: '["Ecosystem", "Food Web", "Energy Flow", "Nitrogen Cycle", "Biodiversity"]' },
        ]
      }
    ]
  }
];

async function main() {
  console.log("Seeding database with premium courses...");

  // Clear existing data
  await prisma.chapterProgress.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.standard.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.note.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // Seed admin user
  const passwordHash = await bcrypt.hash("laherparesh12345", 10);
  await prisma.user.create({
    data: {
      email: "laherparesh56@gmail.com",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
      xp: 9999,
      level: 99,
      streak: 100,
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin"
    }
  });
  console.log("Admin user seeded: laherparesh56@gmail.com");

  // Seed curriculum
  for (const standard of curriculumData) {
    await prisma.standard.create({
      data: {
        id: standard.id,
        name: standard.name,
        subjects: {
          create: standard.subjects.map(subject => ({
            name: subject.name,
            icon: subject.icon,
            color: subject.color,
            chapters: {
              create: subject.chapters.map((chapter, index) => ({
                title: chapter.title,
                summary: chapter.summary,
                videoUrl: chapter.videoUrl,
                orderIndex: index + 1,
                keyConcepts: chapter.keyConcepts
              }))
            }
          }))
        }
      }
    });
    console.log(`✅ Seeded ${standard.name}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
