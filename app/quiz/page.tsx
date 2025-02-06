'use client';

import { QuizCard } from '@/components/cards/quizcard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizData {
  title: string;
  numQuestions: number;
  questions: Question[];
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const supabase = createClient();

  const [quiz, setQuiz] = useState<QuizData | undefined>(undefined);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<null | number>(null);

  const handleSelectAnswer = (
    questionIndex: number,
    selectedOption: string
  ) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let currentScore = 0;
    quiz.questions.forEach((item, index) => {
      if (userAnswers[index] === item.answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
  };
  const close = () => {
    // searchParams.delete('token');
  };
  useEffect(() => {
    const fetchQuiz = async () => {
      if (token) {
        // Try to get quiz from Zustand first
        // If not in Zustand, try to get from Supabase
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', token)
          .single();

        if (data && !error) {
          let fetchedQuiz = {
            title: data.title,
            numQuestions: data.num_questions,
            questions: data.questions,
          };
          if (fetchedQuiz) {
            setQuiz(fetchedQuiz);
          }
        }
      }
    };

    fetchQuiz();
  }, [token]);

  return (
    <main className="flex flex-col items-center justify-center p-6 text-center">
      {quiz ? (
        <>
          <div>
            <span>
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              <p className="text-lg text-gray-600">
                Number of questions: {quiz.numQuestions}
              </p>
            </span>
            {score !== null && (
              <span className="flex text-center items-center justify-center text-2xl">
                Score: <pre>{score}</pre>
              </span>
            )}
          </div>
          <div className="flex flex-col items-center mt-4 space-y-4 w-full">
            {quiz.questions.map((q, index) => (
              <QuizCard
                quiz={q}
                key={index}
                index={index}
                handleSelectAnswer={handleSelectAnswer}
              />
            ))}
          </div>
          <Button
            disabled={
              Object.entries(userAnswers).length != quiz.questions.length
            }
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </>
      ) : (
        <p className="text-red-500">Invalid or missing quiz data.</p>
      )}
    </main>
  );
}
