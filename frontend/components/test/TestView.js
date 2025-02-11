import {Question} from "./Question";
import {useState} from "react";

export function TestView({title, description, questions}) {
    const [answers, setAnswers] = useState({});

    const handleSelect = (questionId, answer) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleSubmit = () => {
        console.log("Selected Answers:");
        questions.forEach((q) => {
            console.log(`Q: ${q.question}`);
            console.log(`A: ${answers[q.id] || "No answer selected"}`);
        });
        alert("TestView submitted!");
    };

    return (
        <div className="container mt-5 p-4 border rounded shadow-lg bg-light">
            <h1 className="text-primary text-center">{title}</h1>
            <h4 className="text-muted text-center">{description}</h4>
            <ol className="list-group list-group-numbered">
                {questions.map((q) => (
                    <li key={q.id} className="list-group-item">
                        <Question
                            questionId={q.id}
                            question={q.question}
                            options={q.options}
                            onSelect={handleSelect}
                            answer={answers[q.id]}
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
