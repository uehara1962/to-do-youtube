"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitExerciseAction } from "@/actions/exercises/submit-exercise-action";
import { toast } from "sonner";
import clsx from "clsx";

interface ExerciseTranslationProps {
  exerciseId: string;
  question: string;
  correctAnswer: string;
  onAnswer?: (isCorrect: boolean) => void;
  options?: string[];
}

export function ExerciseTranslation({
  exerciseId,
  question,
  correctAnswer,
  onAnswer,
}: ExerciseTranslationProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Por favor, digite uma resposta");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("exerciseId", exerciseId);
    formData.append("answer", answer.trim());

    const result = await submitExerciseAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      setIsCorrect(result.isCorrect || false);
      setShowResult(true);
      onAnswer?.(result.isCorrect || false);

      if (result.isCorrect) {
        toast.success("Correto!");
      } else {
        toast.error(`Incorreto. A resposta correta é: ${result.correctAnswer}`);
      }
    } else {
      toast.error(result.error || "Erro ao submeter resposta");
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">{question}</div>

      <Input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Digite sua resposta aqui..."
        disabled={showResult || isSubmitting}
        className="text-lg"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !showResult && !isSubmitting) {
            handleSubmit();
          }
        }}
      />

      {!showResult && (
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Verificando..." : "Verificar"}
        </Button>
      )}

      {showResult && (
        <div className="space-y-4">
          <div
            className={clsx(
              "p-4 rounded-lg",
              isCorrect
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {isCorrect
              ? "Parabéns! Você acertou!"
              : `A resposta correta é: ${correctAnswer}`}
          </div>
        </div>
      )}
    </div>
  );
}
