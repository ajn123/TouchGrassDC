import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../../types';
import QuestionAnswerForm from './QuestionAnswerForm';
import { QuestionAnswer } from '../../types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface QuestionnaireProps {
    initialQuestions: Question[];
}

interface QuestionnaireFormData {
    answers: QuestionAnswer[];
}

interface QuestionnaireProps {
    initialQuestions: Question[];
}


export default function Questionnaire({ initialQuestions }: QuestionnaireProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [submissionErrors, setSubmissionErrors] = useState<Record<string, string[]>>({});

    const { data, setData, post, processing, errors } = useForm<QuestionnaireFormData>({
        answers: initialQuestions.map((q: Question) => ({
            question_id: q.id,
            answer: q.type === 'time' ? '09:00' : '',
            options: []
        }))
    });

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        post(route('question-answers.store'), {
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
                <Head title="Questionnaire - The Breakfast Club" />
                < div className="max-w-4xl mx-auto px-4 py-12">
                    {questions.length > 0 &&
                        <motion.div
                            className="text-center mb-6 text-2xl font-bold text-orange-500"
                            key={currentQuestionIndex}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </motion.div>
                    }

                    {/* Question navigation circles */}
                    <div className="flex justify-center gap-2 mb-8">

                        {questions.length > 0 && questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-[30px] h-[30px] rounded-full transition-colors flex items-center justify-center text-sm font-medium ${index === currentQuestionIndex
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-orange-200 hover:bg-orange-300 text-gray-700'
                                    }`}
                                aria-label={`Go to question ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {Object.keys(submissionErrors).length > 0 && (
                        <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <h3 className="text-red-700 font-semibold mb-2">Please correct the following errors:</h3>
                            <ul className="list-disc list-inside text-red-600">
                                Fill out all questions to complete your profile.
                            </ul>
                        </div>
                    )}

                    {/* Progress bar */}
                    <motion.div
                        className="h-1 bg-orange-200 rounded-full mb-12"
                        initial={{ width: '0%' }}
                    >
                        <motion.div
                            className="h-1 bg-orange-500 rounded-full"
                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            {questions.length > 0 && <QuestionAnswerForm
                                questions={questions}
                                currentQuestionIndex={currentQuestionIndex}
                                data={data}
                                setData={setData}
                                handleBack={handleBack}
                                handleNext={handleNext}
                                processing={processing}
                            />
                            }
                            {questions.length == 0 && (
                                <div className="mb-8 text-center">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        No questions found
                                    </h2>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}