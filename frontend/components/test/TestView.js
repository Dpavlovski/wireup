import {useState} from "react";
import {useRouter} from "next/router";
import TestService, {TestSubmission} from "../../api/tests/test.service";
import Question from "./Question";
import toast, {Toaster} from "react-hot-toast";
import {wait} from "next/dist/lib/wait";

export default function TestView({user, id, title, description, questions}) {
    const router = useRouter();

    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [warning, setWarning] = useState("");

    const handleSelect = (question_id, option_id) => {
        setAnswers((prev) => {
            const updatedAnswers = prev.filter((a) => a.question_id !== question_id);
            return [...updatedAnswers, {question_id, option_id}];
        });
        setWarning("");
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setWarning("");
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setWarning("");
        }
    };

    const handleSubmit = async () => {
        if (answers.length < questions.length) {
            setWarning("Please answer all questions before submitting the test.");
        }
        const unanswered = questions.filter(
            (q) => !answers.find((a) => a.question_id === q.id)
        );
        if (unanswered.length > 0) {
            setWarning("Please answer all questions before submitting the test.");
            return;
        }

        try {
            const testSubmission = new TestSubmission(id, user.id, answers);
            await TestService.submitTest(testSubmission);
            toast.success("Your results have been submitted successfully!");
            await wait(2000);
            await router.push(`/`);
        } catch (error) {
            setWarning("Failed to load submission");
        }
    };

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const answeredCount = answers.length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    const allAnswered = questions.every((q) =>
        answers.find((a) => a.question_id === q.id)
    );

    return (
        <div className="min-h-screen bg-teal-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-teal-800 text-center mb-3">
                            {title}
                        </h1>
                        <p className="text-lg text-teal-700 text-center">{description}</p>
                    </header>
                    <Toaster position={"bottom-right"}/>

                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-teal-800">
                              Progress: {answeredCount}/{totalQuestions} questions
                            </span>
                            <span className="text-sm font-semibold text-teal-800">
                              {progressPercent}% Complete
                            </span>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">

                            </div>

                            <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: "linear-gradient(90deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)",
                                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)"
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                    {warning && (
                        <div className="mb-6 p-4 bg-teal-100 border border-teal-200 text-teal-800 rounded-lg">
                            {warning}
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="p-6 bg-white rounded-lg border border-teal-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-lg font-semibold text-teal-700">
                                    Question {currentIndex + 1} of {totalQuestions}
                                </p>
                                <span className="text-sm text-teal-500">
                                    {allAnswered ? "All answered!" : "Unanswered questions remaining"}
                                </span>
                            </div>

                            <Question
                                question={currentQuestion}
                                options={currentQuestion.options}
                                onSelect={handleSelect}
                                answer={
                                    answers.find((a) => a.question_id === currentQuestion.id)
                                        ?.option_id
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            className={`px-6 py-2 rounded-lg font-medium ${
                                currentIndex === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                            } transition-colors`}
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                        >
                            ← Previous
                        </button>

                        {currentIndex < totalQuestions - 1 ? (
                            <button
                                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                onClick={handleNext}
                            >
                                Next Question →
                            </button>
                        ) : (
                            <button
                                className={`relative px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                    allAnswered
                                        ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md hover:shadow-lg hover:from-teal-700 hover:to-teal-600 transform hover:-translate-y-0.5"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={handleSubmit}
                                disabled={!allAnswered}
                            >
                                {allAnswered ? (
                                    <>
            <span className="relative z-10 flex items-center justify-center">
                Submit
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
            </span>
                                        <span
                                            className="absolute inset-0 bg-white opacity-0 hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
                                    </>
                                ) : (
                                    "Complete all questions"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}