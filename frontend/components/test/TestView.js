import {Question} from "./Question";
import {useState} from "react";
import {submitTest, TestSubmission} from "../../utils/api";
import {useRouter} from "next/router";

export function TestView({id, title, description, questions}) {
    const router = useRouter();
    const [answers, setAnswers] = useState([]);

    const handleSelect = (question_id, option_id) => {
        setAnswers((prev) => {
            const updatedAnswers = prev.filter(a => a.question_id !== question_id);
            return [...updatedAnswers, {question_id, option_id}];
        });
    };

    const handleSubmit = async () => {
        try {
            const test = new TestSubmission(id, "john_doe", answers);
            const response = await submitTest(test);
            alert(response.message);
            await router.push(`/test`);
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Failed to submit test.");
        }
    };

    return (
        <div className="container mt-5 p-4 border rounded shadow-lg bg-light">
            <h1 className="text-primary text-center">{title}</h1>
            <h4 className="text-muted text-center">{description}</h4>
            <ol className="list-group list-group-numbered">
                {questions.map((q) => (
                    <li key={q.id} className="list-group-item">
                        <Question
                            question={q}
                            options={q.options}
                            onSelect={handleSelect}
                            answer={answers.find(a => a.question_id === q.id)?.option_id}
                        />
                    </li>
                ))}
            </ol>
            <button className="btn btn-success w-100 mt-3" onClick={handleSubmit}>
                Submit Test
            </button>
        </div>
    );
}
