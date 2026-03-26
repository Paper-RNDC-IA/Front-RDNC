type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
};

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps): JSX.Element | null {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-300">Preguntas sugeridas</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="rounded-full border border-slate-500/70 bg-slate-700/70 px-2.5 py-1 text-[11px] text-slate-100 transition hover:border-orange-400/60 hover:bg-slate-700 hover:text-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
