import { useEffect, useState } from "react";
import type { QuizQuestion } from "../../types/media";
import Loader from "../loader";
import { IoMdCheckmark } from "react-icons/io";

interface QuizProps {
  questions: QuizQuestion[];
}

const QuizPlayer = ({ questions }: QuizProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const selected = answers[currentIndex];
  const [loading, setLoading] = useState<boolean>(true);

  function handleOptionSelect(index: number) {
    if (answers[currentIndex] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
    }
  }

  function goBack() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  const score = answers.reduce((acc, ans, i) => {
    return ans === questions[i].correctIndex ? acc! + 1 : acc;
  }, 0);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <Loader visible={true} />;
  }
  return (
    <div
      style={{
        maxWidth: 500,
        width: "100%",
        margin: "0 auto 20px ",
        padding: 20,
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        background: "#f9f9f9",
        borderRadius: 12,
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 15 }}>Quiz</h2>

      {!submitted ? (
        <>
          {/* Progress Bar */}
          <div
            aria-label={`Question ${currentIndex + 1} of ${questions.length}`}
            style={{
              marginBottom: 15,
              height: 16,
              background: "#ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                background: "#009b9b",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: 15,
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#333",
              textAlign: "center",
            }}
          >
            Question {currentIndex + 1} of {questions.length}
          </div>

          {/* Question Text */}
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#ff6b35",
              marginBottom: 8,
            }}
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />

          {/* Options */}
          <div>
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selected === i;
              const isAnswered = selected !== null;
              const isCorrect = currentQuestion.correctIndex === i;

              return (
                <label
                  key={i}
                  onClick={() => handleOptionSelect(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: isAnswered ? "default" : "pointer",
                    userSelect: "none",
                    backgroundColor: isAnswered
                      ? isCorrect
                        ? "#c8e6c9"
                        : isSelected
                        ? "#ffcdd2"
                        : "white"
                      : isSelected
                      ? "#bbdefb"
                      : "white",
                    border: "1.5px solid #ccc",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 10,
                    fontSize: "1rem",
                    color: "#333",
                    transition: "background-color 0.3s ease",
                    pointerEvents: isAnswered ? "none" : "auto",
                  }}
                >
                  {/* Custom square radio */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      minWidth: 18,
                      minHeight: 18,
                      border: `1px solid ${isSelected ? '#f97316' : '#ccc'}`,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                      backgroundColor: isSelected ? "#f97316" : "white",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {isSelected && <IoMdCheckmark />}
                  </div>

                  {/* Hidden actual radio input */}
                  <input
                    type="radio"
                    name={`q${currentIndex}`}
                    checked={isSelected}
                    readOnly
                    style={{
                      display: "none",
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>

          {/* Description box - show only after answer selected */}
          {selected !== null && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: "#e0f7f7",
                border: "2px solid #009b9b",
                borderRadius: 10,
                fontSize: "1rem",
                color: "#004d4d",
                fontStyle: "italic",
                boxShadow: "0 2px 8px rgba(0, 155, 155, 0.2)",
              }}
            >
              {currentQuestion.description}
            </div>
          )}

          {/* Navigation Buttons */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={goBack}
              disabled={currentIndex === 0}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                minWidth: 100,
                borderRadius: 8,
                border: "none",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                backgroundColor: "#009b9b",
                color: "white",
                opacity: currentIndex === 0 ? 0.5 : 1,
              }}
            >
              Previous
            </button>

            <button
              onClick={goNext}
              disabled={selected === null}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                minWidth: 100,
                borderRadius: 8,
                border: "none",
                cursor: selected === null ? "not-allowed" : "pointer",
                backgroundColor: "#ff6b35",
                color: "white",
                opacity: selected === null ? 0.5 : 1,
              }}
            >
              {currentIndex === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            animation: "fadeIn 1s ease forwards",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h3>
            You scored {score} out of {questions.length}
          </h3>
          <p style={{ fontSize: "1.1rem", color: "#666" }}>
            {score === questions.length
              ? "Excellent! You got all correct."
              : score! >= questions.length / 2
              ? "Good job! Keep practicing."
              : "Keep trying, you'll improve!"}
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setAnswers(Array(questions.length).fill(null));
              setSubmitted(false);
            }}
            style={{
              marginTop: 20,
              padding: "12px 25px",
              fontSize: "1.2rem",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#009b9b",
              color: "white",
              cursor: "pointer",
            }}
          >
            Restart Quiz
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizPlayer;
