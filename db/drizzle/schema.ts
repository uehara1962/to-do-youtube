import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabela de usuários (pode manter a sua ou adaptar)
export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de sessões
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Tabela de contas (para OAuth)
export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  password: text("password"), // Para autenticação por email/senha
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de verificação de email
export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de autenticação de dois fatores
export const twoFactor = pgTable("twoFactor", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  secret: text("secret"),
  backupCodes: jsonb("backup_codes"), // Array de códigos de backup
  enabled: boolean("enabled").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de todos (atualizada com userId)
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  imageUrl: text("image_url"), // URL da imagem no Cloudinary
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Tabela de lições de inglês
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  level: integer("level").notNull().default(1),
  order: integer("order").notNull().default(0),
  section: text("section").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de exercícios
export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "multiple_choice", "translation", "fill_blank", "listening", "speaking"
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options"), // Array de opções para múltipla escolha
  audioUrl: text("audio_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de progresso do usuário
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score").default(0).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de respostas dos usuários
export const userAnswers = pgTable("user_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptedAt: timestamp("attempted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de posts do blog
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  mediaType: text("media_type").notNull().default("text"), // "text", "image", "video", "image_text", "video_text"
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de curtidas nos posts
export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de comentários nos posts
export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const lessonsRelations = relations(lessons, ({ many }) => ({
  exercises: many(exercises),
  userProgress: many(userProgress),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
  userAnswers: many(userAnswers),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  user: one(users, {
    fields: [userAnswers.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [userAnswers.exerciseId],
    references: [exercises.id],
  }),
}));

// Relations para posts
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(postLikes),
  comments: many(postComments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

export type TodoTableSelectModel = typeof todos.$inferSelect;
export type TodoTableInsertModel = typeof todos.$inferInsert;
export type UserTableSelectModel = typeof users.$inferSelect;
export type UserTableInsertModel = typeof users.$inferInsert;
export type LessonTableSelectModel = typeof lessons.$inferSelect;
export type LessonTableInsertModel = typeof lessons.$inferInsert;
export type ExerciseTableSelectModel = typeof exercises.$inferSelect;
export type ExerciseTableInsertModel = typeof exercises.$inferInsert;
export type UserProgressTableSelectModel = typeof userProgress.$inferSelect;
export type UserProgressTableInsertModel = typeof userProgress.$inferInsert;
export type UserAnswerTableSelectModel = typeof userAnswers.$inferSelect;
export type UserAnswerTableInsertModel = typeof userAnswers.$inferInsert;
export type PostTableSelectModel = typeof posts.$inferSelect;
export type PostTableInsertModel = typeof posts.$inferInsert;
export type PostLikeTableSelectModel = typeof postLikes.$inferSelect;
export type PostLikeTableInsertModel = typeof postLikes.$inferInsert;
export type PostCommentTableSelectModel = typeof postComments.$inferSelect;
export type PostCommentTableInsertModel = typeof postComments.$inferInsert;
