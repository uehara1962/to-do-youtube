"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitExerciseAction } from "@/actions/exercises/submit-exercise-action";
import { toast } from "sonner";
import clsx from "clsx";
import { Mic, MicOff, Play, Pause, Check, X } from "lucide-react";

interface ExerciseSpeakingProps {
  exerciseId: string;
  question: string;
  correctAnswer: string;
  audioUrl?: string | null;
  onAnswer?: (isCorrect: boolean) => void;
}

// Check if Web Speech API is available
const isSpeechRecognitionAvailable = () => {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

export function ExerciseSpeaking({
  exerciseId,
  question,
  correctAnswer,
  audioUrl,
  onAnswer,
}: ExerciseSpeakingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  // const [audioUrlLocal, setAudioUrlLocal] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechSupported = isSpeechRecognitionAvailable();

  useEffect(() => {
    // Initialize Speech Recognition
    if (speechSupported && typeof window !== "undefined") {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US"; // English language

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setRecognizedText(transcript.trim());
          setIsProcessing(false);
          setIsRecording(false);
          // Clear timeout if speech was detected
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsProcessing(false);
          setIsRecording(false);

          // Handle different error types
          if (event.error === "no-speech") {
            // "no-speech" is expected when user doesn't speak - not a critical error
            console.log("No speech detected - user may try again");
            toast.info(
              "Nenhuma fala detectada. Clique no microfone para tentar novamente."
            );
          } else if (event.error === "not-allowed") {
            console.error("Microphone permission denied");
            toast.error(
              "Permissão de microfone negada. Verifique as configurações."
            );
          } else if (event.error === "aborted") {
            // User stopped recording - not an error
            console.log("Speech recognition aborted by user");
          } else {
            console.error("Speech recognition error:", event.error);
            toast.error(`Erro no reconhecimento: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          setIsProcessing(false);
          // Clear timeout when recognition ends
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors when stopping recognition
        }
      }
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [speechSupported]);

  const startRecording = () => {
    if (!speechSupported) {
      toast.error(
        "Reconhecimento de voz não suportado neste navegador. Use Chrome, Edge ou Safari."
      );
      return;
    }

    if (!recognitionRef.current) {
      toast.error("Reconhecimento de voz não disponível.");
      return;
    }

    try {
      setRecognizedText("");
      setIsRecording(true);
      setIsProcessing(true);
      recognitionRef.current.start();

      // Set a timeout to stop recognition after 10 seconds if no speech detected
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // Ignore errors when stopping
          }
          setIsRecording(false);
          setIsProcessing(false);
          toast.info(
            "Tempo limite atingido. Clique no microfone para tentar novamente."
          );
        }
      }, 10000); // 10 seconds timeout
    } catch (error) {
      console.error("Error starting recognition:", error);
      toast.error("Erro ao iniciar reconhecimento de voz.");
      setIsRecording(false);
      setIsProcessing(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsProcessing(false);
      // Clear timeout when manually stopping
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  const clearText = () => {
    setRecognizedText("");
    setShowResult(false);
  };

  const handleSubmit = async () => {
    if (!recognizedText.trim()) {
      toast.error("Por favor, fale sua resposta primeiro");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("exerciseId", exerciseId);
    formData.append("answer", recognizedText.trim());

    const result = await submitExerciseAction(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsCorrect(result.isCorrect || false);
      setShowResult(true);
      onAnswer?.(result.isCorrect || false);

      if (result.isCorrect) {
        toast.success("Parabéns! Pronúncia correta!");
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

      {/* Reference Audio (if available) */}
      {audioUrl && (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 rounded-lg">
          <button
            onClick={() => {
              if (playbackAudioRef.current) {
                playbackAudioRef.current.pause();
              }
              const audio = new Audio(audioUrl);
              playbackAudioRef.current = audio;
              audio.play();
              setIsPlaying(true);
              audio.onended = () => setIsPlaying(false);
            }}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <span className="text-sm text-gray-400">Ouvir exemplo</span>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isSubmitting || showResult}
              className="p-6 rounded-full bg-red-500 hover:bg-red-600"
            >
              <Mic className="w-8 h-8" />
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="p-6 rounded-full bg-red-600 hover:bg-red-700 animate-pulse"
            >
              <MicOff className="w-8 h-8" />
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="text-red-400 font-semibold animate-pulse text-center">
            {isProcessing ? "Ouvindo... Fale agora!" : "Processando..."}
          </div>
        )}

        {/* Recognized Text Display */}
        {recognizedText && !isRecording && (
          <div className="w-full space-y-3">
            <div className="p-4 bg-gray-700 rounded-lg border-2 border-blue-500">
              <p className="text-sm text-gray-400 mb-2">Texto reconhecido:</p>
              <p className="text-lg font-semibold text-white">
                {recognizedText}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearText} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Regravar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || showResult}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {isSubmitting ? "Verificando..." : "Verificar"}
              </Button>
            </div>
          </div>
        )}
      </div>

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
            ? "Parabéns! Pronúncia correta!"
            : `Tente novamente. A resposta esperada é: ${correctAnswer}`}
        </div>
      )}

      {/* Info Message */}
      {!speechSupported && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-400">
          <p className="font-semibold mb-2">Navegador não suportado:</p>
          <p>
            O reconhecimento de voz funciona melhor no Chrome, Edge ou Safari.
            Por favor, use um desses navegadores para a melhor experiência.
          </p>
        </div>
      )}

      {speechSupported && !recognizedText && !isRecording && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400">
          <p className="font-semibold mb-2">Como usar:</p>
          <p>
            1. Clique no botão do microfone para começar a gravar
            <br />
            2. Fale claramente em inglês
            <br />
            3. O texto reconhecido aparecerá automaticamente
            <br />
            4. Clique em &quot;Verificar&quot; para validar sua resposta
          </p>
        </div>
      )}
    </div>
  );
}
