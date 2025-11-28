import { db } from "./drizzle";
import { lessons, exercises } from "./drizzle/schema";

async function seedLessons() {
  console.log("Seeding lessons and exercises...");

  // Seção 1: Básico - Saudações
  const lesson1 = await db
    .insert(lessons)
    .values({
      title: "Saudações",
      description: "Aprenda a cumprimentar em inglês",
      level: 1,
      order: 1,
      section: "Seção 1",
    })
    .returning();

  const lesson1Id = lesson1[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson1Id,
      type: "translation",
      question: "Traduza: Olá",
      correctAnswer: "Hello",
      order: 1,
    },
    {
      lessonId: lesson1Id,
      type: "multiple_choice",
      question: "Como você diz 'Bom dia' em inglês?",
      correctAnswer: "Good morning",
      options: ["Good morning", "Good night", "Good afternoon", "Good evening"],
      order: 2,
    },
    {
      lessonId: lesson1Id,
      type: "fill_blank",
      question: "Complete: ___ are you?",
      correctAnswer: "How",
      order: 3,
    },
    {
      lessonId: lesson1Id,
      type: "speaking",
      question: "Say: Hello",
      correctAnswer: "Hello",
      order: 4,
    },
    {
      lessonId: lesson1Id,
      type: "speaking",
      question: "Say: Good morning",
      correctAnswer: "Good morning",
      order: 5,
    },
    {
      lessonId: lesson1Id,
      type: "translation",
      question: "Traduza: Tchau",
      correctAnswer: "Goodbye",
      order: 6,
    },
    {
      lessonId: lesson1Id,
      type: "multiple_choice",
      question: "Qual é a resposta correta para 'How are you?'?",
      correctAnswer: "I'm fine, thank you",
      options: ["I'm fine, thank you", "I'm bad", "I'm sad", "I'm angry"],
      order: 7,
    },
    {
      lessonId: lesson1Id,
      type: "speaking",
      question: "Say: How are you?",
      correctAnswer: "How are you",
      order: 8,
    },
  ]);

  // Seção 1: Básico - Números
  const lesson2 = await db
    .insert(lessons)
    .values({
      title: "Números",
      description: "Aprenda os números de 1 a 10",
      level: 1,
      order: 2,
      section: "Seção 1",
    })
    .returning();

  const lesson2Id = lesson2[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson2Id,
      type: "translation",
      question: "Traduza: Um",
      correctAnswer: "One",
      order: 1,
    },
    {
      lessonId: lesson2Id,
      type: "multiple_choice",
      question: "Como você escreve '5' em inglês?",
      correctAnswer: "Five",
      options: ["Five", "Four", "Six", "Seven"],
      order: 2,
    },
    {
      lessonId: lesson2Id,
      type: "fill_blank",
      question: "Complete: Ten minus five equals ___",
      correctAnswer: "five",
      order: 3,
    },
    {
      lessonId: lesson2Id,
      type: "multiple_choice",
      question: "Qual número vem depois de 'eight'?",
      correctAnswer: "Nine",
      options: ["Nine", "Ten", "Seven", "Six"],
      order: 4,
    },
  ]);

  // Seção 1: Básico - Cores
  const lesson3 = await db
    .insert(lessons)
    .values({
      title: "Cores",
      description: "Aprenda as cores básicas",
      level: 1,
      order: 3,
      section: "Seção 1",
    })
    .returning();

  const lesson3Id = lesson3[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson3Id,
      type: "translation",
      question: "Traduza: Azul",
      correctAnswer: "Blue",
      order: 1,
    },
    {
      lessonId: lesson3Id,
      type: "multiple_choice",
      question: "Qual é a cor do sol?",
      correctAnswer: "Yellow",
      options: ["Yellow", "Blue", "Green", "Red"],
      order: 2,
    },
    {
      lessonId: lesson3Id,
      type: "fill_blank",
      question: "Complete: The sky is ___",
      correctAnswer: "blue",
      order: 3,
    },
    {
      lessonId: lesson3Id,
      type: "multiple_choice",
      question: "Como você diz 'vermelho' em inglês?",
      correctAnswer: "Red",
      options: ["Red", "Green", "Blue", "Yellow"],
      order: 4,
    },
  ]);

  // Seção 2: Intermediário - Verbos Comuns
  const lesson4 = await db
    .insert(lessons)
    .values({
      title: "Verbos Comuns",
      description: "Aprenda verbos essenciais do dia a dia",
      level: 2,
      order: 1,
      section: "Seção 2",
    })
    .returning();

  const lesson4Id = lesson4[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson4Id,
      type: "translation",
      question: "Traduza: Comer",
      correctAnswer: "Eat",
      order: 1,
    },
    {
      lessonId: lesson4Id,
      type: "multiple_choice",
      question: "Como você diz 'beber' em inglês?",
      correctAnswer: "Drink",
      options: ["Drink", "Eat", "Sleep", "Run"],
      order: 2,
    },
    {
      lessonId: lesson4Id,
      type: "fill_blank",
      question: "Complete: I ___ to school every day",
      correctAnswer: "go",
      order: 3,
    },
    {
      lessonId: lesson4Id,
      type: "multiple_choice",
      question: "Qual é o passado de 'go'?",
      correctAnswer: "Went",
      options: ["Went", "Goed", "Gone", "Going"],
      order: 4,
    },
  ]);

  // Seção 2: Intermediário - Frases do Dia a Dia
  const lesson5 = await db
    .insert(lessons)
    .values({
      title: "Frases do Dia a Dia",
      description: "Expressões comuns em conversas",
      level: 2,
      order: 2,
      section: "Seção 2",
    })
    .returning();

  const lesson5Id = lesson5[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson5Id,
      type: "translation",
      question: "Traduza: Por favor",
      correctAnswer: "Please",
      order: 1,
    },
    {
      lessonId: lesson5Id,
      type: "multiple_choice",
      question: "Como você diz 'obrigado' em inglês?",
      correctAnswer: "Thank you",
      options: ["Thank you", "Please", "Sorry", "Excuse me"],
      order: 2,
    },
    {
      lessonId: lesson5Id,
      type: "fill_blank",
      question: "Complete: ___ me, where is the bathroom?",
      correctAnswer: "Excuse",
      order: 3,
    },
    {
      lessonId: lesson5Id,
      type: "multiple_choice",
      question: "Qual é a resposta para 'Thank you'?",
      correctAnswer: "You're welcome",
      options: ["You're welcome", "Thank you", "Please", "Sorry"],
      order: 4,
    },
    {
      lessonId: lesson5Id,
      type: "speaking",
      question: "Say: Thank you",
      correctAnswer: "Thank you",
      order: 5,
    },
    {
      lessonId: lesson5Id,
      type: "speaking",
      question: "Say: You're welcome",
      correctAnswer: "You're welcome",
      order: 6,
    },
  ]);

  // Seção 2: Intermediário - Pronúncia e Speaking
  const lesson6 = await db
    .insert(lessons)
    .values({
      title: "Pronúncia e Speaking",
      description: "Pratique sua pronúncia em inglês",
      level: 2,
      order: 3,
      section: "Seção 2",
    })
    .returning();

  const lesson6Id = lesson6[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: My name is John",
      correctAnswer: "My name is John",
      order: 1,
    },
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: Nice to meet you",
      correctAnswer: "Nice to meet you",
      order: 2,
    },
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: I am from Brazil",
      correctAnswer: "I am from Brazil",
      order: 3,
    },
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: What is your name?",
      correctAnswer: "What is your name",
      order: 4,
    },
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: Where are you from?",
      correctAnswer: "Where are you from",
      order: 5,
    },
    {
      lessonId: lesson6Id,
      type: "speaking",
      question: "Say: I speak English",
      correctAnswer: "I speak English",
      order: 6,
    },
  ]);

  // Seção 3: Avançado - Frases Completas
  const lesson7 = await db
    .insert(lessons)
    .values({
      title: "Frases Completas",
      description: "Pratique frases completas em inglês",
      level: 3,
      order: 1,
      section: "Seção 3",
    })
    .returning();

  const lesson7Id = lesson7[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: I like to read books",
      correctAnswer: "I like to read books",
      order: 1,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: Can you help me please?",
      correctAnswer: "Can you help me please",
      order: 2,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: I don't understand",
      correctAnswer: "I don't understand",
      order: 3,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: How much does it cost?",
      correctAnswer: "How much does it cost",
      order: 4,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: I would like a coffee",
      correctAnswer: "I would like a coffee",
      order: 5,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: What time is it?",
      correctAnswer: "What time is it",
      order: 6,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: I'm sorry, I'm late",
      correctAnswer: "I'm sorry I'm late",
      order: 7,
    },
    {
      lessonId: lesson7Id,
      type: "speaking",
      question: "Say: Have a nice day",
      correctAnswer: "Have a nice day",
      order: 8,
    },
  ]);

  // Seção 3: Avançado - Conversação Diária
  const lesson8 = await db
    .insert(lessons)
    .values({
      title: "Conversação Diária",
      description: "Pratique conversas do dia a dia",
      level: 3,
      order: 2,
      section: "Seção 3",
    })
    .returning();

  const lesson8Id = lesson8[0].id;

  await db.insert(exercises).values([
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: How was your day?",
      correctAnswer: "How was your day",
      order: 1,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: It was great, thank you",
      correctAnswer: "It was great thank you",
      order: 2,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: What do you do for a living?",
      correctAnswer: "What do you do for a living",
      order: 3,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: I work as a teacher",
      correctAnswer: "I work as a teacher",
      order: 4,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: What are your hobbies?",
      correctAnswer: "What are your hobbies",
      order: 5,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: I enjoy playing soccer",
      correctAnswer: "I enjoy playing soccer",
      order: 6,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: Let's meet tomorrow",
      correctAnswer: "Let's meet tomorrow",
      order: 7,
    },
    {
      lessonId: lesson8Id,
      type: "speaking",
      question: "Say: See you later",
      correctAnswer: "See you later",
      order: 8,
    },
  ]);

  console.log("Lessons and exercises seeded successfully!");
}

// Execute seed if run directly
if (require.main === module) {
  seedLessons()
    .then(() => {
      console.log("Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error seeding:", error);
      process.exit(1);
    });
}

export { seedLessons };
