import {useState} from "react";
import {Question} from "./Question";
import {submitTest, TestSubmission} from "../../utils/api";
import {useRouter} from "next/router";

export function TestView({user, id, title, description, questions}) {
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
            return;
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
            const response = await submitTest(testSubmission);
            alert(response.message);
            await router.push(`/`);
        } catch (error) {
            console.error("Error submitting tests:", error);
            alert("Failed to submit test.");
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
        <div
            className="container mt-5 p-4 border rounded shadow-lg bg-light"
            style={{maxWidth: "800px"}}
        >
            <h1 className="text-primary text-center">{title}</h1>
            <h5 className="text-muted text-center mb-4">{description}</h5>

            <div className="mb-4">
                <div className="progress" style={{height: "24px"}}>
                    <div
                        className="progress-bar progress-bar-striped bg-info"
                        role="progressbar"
                        style={{width: `${progressPercent}%`}}
                        aria-valuenow={progressPercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {progressPercent}%
                    </div>
                </div>
            </div>

            {warning && (
                <div className="alert alert-warning" role="alert">
                    {warning}
                </div>
            )}

            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">
                        Question {currentIndex + 1} of {totalQuestions}
                    </h5>
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

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-outline-secondary"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>

                {currentIndex < totalQuestions - 1 ? (
                    <button className="btn btn-primary" onClick={handleNext}>
                        Next
                    </button>
                ) : (
                    <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                    >
                        Submit Test
                    </button>
                )}
            </div>
        </div>
    );
}
