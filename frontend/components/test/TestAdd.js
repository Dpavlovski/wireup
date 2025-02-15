import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function CreateTest() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([{question: "", options: ["", ""]}]);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, {question: "", options: ["", ""]}]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newTest = {title, description, questions};

        try {
            const response = await fetch("/api/tests", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTest),
            });

            if (!response.ok) throw new Error("Failed to create test");

            router.push("/");  // Redirect to homepage after submission
        } catch (error) {
            console.error("Error creating test:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create New Test</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Test Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {questions.map((question, index) => (
                    <div key={index} className="mb-3">
                        <label htmlFor={`question-${index}`} className="form-label">
                            Question {index + 1}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id={`question-${index}`}
                            value={question.question}
                            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                            placeholder="Enter question"
                        />
                        <div>
                            <label className="form-label mt-2">Options</label>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={option}
                                        onChange={(e) =>
                                            handleQuestionChange(
                                                index,
                                                "options",
                                                question.options.map((opt, i) =>
                                                    i === optionIndex ? e.target.value : opt
                                                )
                                            )
                                        }
                                        placeholder={`Option ${optionIndex + 1}`}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    handleQuestionChange(index, "options", [...question.options, ""])
                                }
                            >
                                Add Option
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
                    Add Question
                </button>

                <button type="submit" className="btn btn-primary mt-4">
                    Submit Test
                </button>
            </form>
        </div>
    );
}
