"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitExerciseAction } from "@/actions/exercises/submit-exercise-action";
import { toast } from "sonner";
import clsx from "clsx";

interface ExerciseMultipleChoiceProps {
  exerciseId: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  onAnswer?: (isCorrect: boolean) => void;
}

export function ExerciseMultipleChoice({
  exerciseId,
  question,
  options,
  correctAnswer,
  onAnswer,
}: ExerciseMultipleChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      toast.error("Por favor, selecione uma resposta");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("exerciseId", exerciseId);
    formData.append("answer", selectedAnswer);

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

      <div className="space-y-2">
        {(options || []).map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && setSelectedAnswer(option)}
            disabled={showResult || isSubmitting}
            className={clsx(
              "w-full text-left p-4 rounded-lg border-2 transition-colors",
              selectedAnswer === option
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 hover:border-gray-500",
              showResult &&
                option === correctAnswer &&
                "border-green-500 bg-green-500/20",
              showResult &&
                selectedAnswer === option &&
                !isCorrect &&
                "border-red-500 bg-red-500/20",
              (showResult || isSubmitting) && "cursor-not-allowed opacity-75"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {!showResult && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitting}
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
