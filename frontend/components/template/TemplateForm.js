import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import BackButton from "../back_button/BackButton";
import TestService from "../../api/tests/test.service";
import TemplateService from "../../api/templates/template.service";

export default function TemplateForm({isPreview = false, initialData}) {


    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(!isPreview);
    const [hasExistingTests, setHasExistingTests] = useState(false);

    const isDisabled = isPreview && !isEditing;

    useEffect(() => {
        const initializeForm = async () => {
            if (initialData) {
                setTitle(initialData.test?.title || "");
                setDescription(initialData.test?.description || "");
                setQuestions(
                    initialData.questions?.map(q => ({
                        question: q.question?.question || "",
                        options: q.options?.map(o =>
                            typeof o === 'object' ? o.value : o
                        ) || []
                    })) || []
                );

                try {
                    const exists = await TestService.checkExistingTests(initialData.test.id);
                    setHasExistingTests(exists);
                } catch (error) {
                    setHasExistingTests(true);
                }
            }
            setIsEditing(!isPreview);
        };

        initializeForm();
    }, [initialData, isPreview]);

    const MAX_QUESTIONS = 50;
    const MIN_OPTIONS = 2;
    const MAX_OPTIONS = 10;
    const recommendedOptions = ["1", "2", "3", "4", "5"];


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
        if (!title.trim() || !description.trim() || !validateQuestions()) {
            toast.error("Please fill all required fields");
            return;
        }

        const templateData = {title, description, questions};

        try {
            if (initialData) {
                await TemplateService.editTemplate(initialData.test.id, templateData);
                router.push("/admin/templates")
                toast.success("Template updated successfully");
            } else {
                await TemplateService.addTemplate(templateData);
                toast.success("Template created successfully");
            }
            router.push("/admin/templates");
        } catch (error) {
            toast.error(error.response?.data?.detail || "An error occurred");
        }
    };

    const handleBack = () => {
        router.push("/admin/templates");
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-teal-800">
                    {initialData
                        ? (isEditing ? "Edit Template" : "Template Preview")
                        : "Create New Template"}
                </h1>
                <BackButton onClick={handleBack}/>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 border border-teal-50">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">
                            Template Title *
                        </label>
                        {isPreview && !isEditing ? (
                            <div className="text-lg font-medium text-teal-900">{title}</div>
                        ) : (
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter template title"
                                required
                                disabled={isDisabled}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">
                            Description *
                        </label>
                        {isPreview && !isEditing ? (
                            <p className="text-teal-700 whitespace-pre-line">{description}</p>
                        ) : (
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter template description"
                                required
                                disabled={isDisabled}
                            />
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-teal-800">Questions</h3>
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-lg border border-teal-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-medium text-teal-700">
                                        Question {qIndex + 1}
                                    </span>
                                    {(isEditing || !isPreview) && questions.length > 1 && (
                                        <button
                                            type="button"
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            onClick={() => handleRemoveQuestion(qIndex)}
                                            disabled={isDisabled}
                                        >
                                            Remove Question
                                        </button>
                                    )}
                                </div>

                                {isPreview && !isEditing ? (
                                    <h4 className="text-base font-medium text-teal-900 mb-4">{question.question}</h4>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                        placeholder="Enter question"
                                        required
                                        disabled={isDisabled}
                                    />
                                )}

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-teal-700">Options</label>
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                            {isPreview && !isEditing ? (
                                                <div className="flex items-center w-full p-3 bg-teal-50 rounded-lg">
                                                    <span className="text-teal-800">{option}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        required
                                                        disabled={isDisabled}
                                                    />
                                                    {(isEditing || !isPreview) && question.options.length > MIN_OPTIONS && (
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1.5 text-red-600 hover:text-red-700 font-medium"
                                                            onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                            disabled={isDisabled}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {(isEditing || !isPreview) && (
                                    <button
                                        type="button"
                                        className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                        onClick={() => handleAddOption(qIndex)}
                                        disabled={isDisabled || question.options.length >= MAX_OPTIONS}
                                    >
                                        + Add Option
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {(isEditing || !isPreview) && (
                    <div className="flex justify-between items-center border-t border-teal-100 pt-6">
                        <button
                            type="button"
                            className="px-6 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg font-medium"
                            onClick={handleAddQuestion}
                            disabled={isDisabled || questions.length >= MAX_QUESTIONS}
                        >
                            + Add Question
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                        >
                            {initialData ? "Save Changes" : "Create Template"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
