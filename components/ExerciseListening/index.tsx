"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitExerciseAction } from "@/actions/exercises/submit-exercise-action";
import { toast } from "sonner";
import clsx from "clsx";
import { Volume2, Play, Pause } from "lucide-react";

interface ExerciseListeningProps {
  exerciseId: string;
  question: string;
  correctAnswer: string;
  audioUrl?: string | null;
  options?: string[];
  onAnswer?: (isCorrect: boolean) => void;
}

export function ExerciseListening({
  exerciseId,
  question,
  correctAnswer,
  audioUrl,
  options,
  onAnswer,
}: ExerciseListeningProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayAudio = () => {
    if (!audioUrl) {
      toast.error("Áudio não disponível");
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
    }
  };

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
    <div className="space-y-6">
      <div className="text-lg font-semibold">{question}</div>

      {/* Audio Player */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePlayAudio}
          className={clsx(
            "p-4 rounded-full transition-all",
            audioUrl
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-600 cursor-not-allowed opacity-50"
          )}
          disabled={!audioUrl}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
        {audioUrl && (
          <span className="text-sm text-gray-400">
            Clique para ouvir o áudio
          </span>
        )}
        {!audioUrl && (
          <span className="text-sm text-gray-500">
            Áudio não disponível (use texto como referência)
          </span>
        )}
      </div>

      {/* Options */}
      {options && options.length > 0 && (
        <div className="space-y-2">
          {options.map((option, index) => (
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
      )}

      {/* Text Input Fallback */}
      {(!options || options.length === 0) && (
        <div className="space-y-4">
          <input
            type="text"
            value={selectedAnswer || ""}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            placeholder="Digite o que você ouviu..."
            disabled={showResult || isSubmitting}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showResult && !isSubmitting) {
                handleSubmit();
              }
            }}
          />
        </div>
      )}

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
      )}
    </div>
  );
}
