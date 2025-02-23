import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {addTemplate} from "../../utils/api";

export default function TemplateForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const recommendedOptions = ["1", "2", "3", "4", "5"];

    const [questions, setQuestions] = useState([{question: "", options: [...recommendedOptions]}]);

    const MAX_QUESTIONS = 50;
    const MIN_OPTIONS = 2;
    const MAX_OPTIONS = 10;

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
        if (questions.length >= MAX_QUESTIONS) {
            alert("Maximum number of questions reached.");
            return;
        }
        setQuestions([...questions, {question: "", options: [...recommendedOptions]}]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleAddOption = (qIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length >= MAX_OPTIONS) {
            alert("Maximum number of options reached for this question.");
            return;
        }
        updatedQuestions[qIndex].options.push("");
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length > MIN_OPTIONS) {
            updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
            setQuestions(updatedQuestions);
        } else {
            alert("Each question must have at least 2 options.");
        }
    };

    const validateQuestions = () => {
        if (questions.length === 0) {
            alert("At least one question is required.");
            return false;
        }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) {
                alert(`Question ${i + 1} cannot be empty.`);
                return false;
            }
            if (q.options.length < MIN_OPTIONS) {
                alert(`Question ${i + 1} must have at least ${MIN_OPTIONS} options.`);
                return false;
            }
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].trim()) {
                    alert(`Option ${j + 1} in Question ${i + 1} cannot be empty.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim()) {
            alert("Title is required.");
            return;
        }
        if (!description.trim()) {
            alert("Description is required.");
            return;
        }
        if (!validateQuestions()) {
            return;
        }
        const newTemplate = {title, description, questions};
        await addTemplate(newTemplate);
        router.push("/test/templates");
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Create New Test Template</h1>
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

                <h3 className="mt-4">Questions</h3>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label mb-0">Question {qIndex + 1}</label>
                                {questions.length > 1 && (
                                    <button type="button" className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveQuestion(qIndex)}>
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
                                required
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
                                            required
                                        />
                                        {question.options.length > MIN_OPTIONS && (
                                            <button type="button" className="btn btn-danger"
                                                    onClick={() => handleRemoveOption(qIndex, oIndex)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-secondary btn-sm"
                                        onClick={() => handleAddOption(qIndex)}>
                                    Add Option
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
                        Create Template
                    </button>
                </div>
            </form>
        </div>
    );
}
