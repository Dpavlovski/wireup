import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addTest } from "../../utils/api";

export default function TestForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [sector, setSector] = useState("");

    const defaultOptions = ["1", "2", "3", "4", "5"];

    const [questions, setQuestions] = useState([{ question: "", options: defaultOptions }]);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: defaultOptions }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        }
    };

    const handleAddOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push("");
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length > 1) {
            updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
            setQuestions(updatedQuestions);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim() || !description.trim() || !password.trim() || !sector.trim()) {
            alert("Please fill in all required fields.");
            return;
        }
        const newTest = { title, description, password, sector, questions };
        await addTest(newTest);
        router.push("/test");

    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Create New Test</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Test Title *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter test title"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description *
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter test description"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="sector" className="form-label">
                        Sector *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Enter sector"
                        required
                    />
                </div>

                <h3 className="mt-4">Questions (Optional)</h3>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label mb-0">Question {qIndex + 1}</label>
                                {questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                    >
                                        Remove Question
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                className="form-control mb-3"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                placeholder="Enter question"
                            />
                            <div>
                                <label className="form-label">Options</label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                        {question.options.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleAddOption(qIndex)}
                                >
                                    Add Custom Option
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="d-flex justify-content-between mt-4">
                    <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
                        Add Question
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Submit Test
                    </button>
                </div>
            </form>
        </div>
    );
}
