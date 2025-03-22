import { useState, useEffect } from "react";
import { FORM_CONSTANTS } from "../utils/constants";

export const useTemplateForm = (initialData, isPreview) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(!isPreview);

    const {
        MAX_QUESTIONS,
        MIN_OPTIONS,
        MAX_OPTIONS,
        RECOMMENDED_OPTIONS
    } = FORM_CONSTANTS;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.test?.title || "");
            setDescription(initialData.test?.description || "");
            setQuestions(
                initialData.questions?.map(q => ({
                    question: q.question?.question || "",
                    options: q.options?.map(o => typeof o === 'object' ? o.value : o) || []
                })) || []
            );
        }
        setIsEditing(!isPreview);
    }, [initialData, isPreview]);

    // Handler functions...

    return {
        title,
        setTitle,
        description,
        setDescription,
        questions,
        setQuestions,
        isEditing,
        setIsEditing,
        handleQuestionChange,
        handleOptionChange,
        handleAddQuestion,
        handleRemoveQuestion,
        handleAddOption,
        handleRemoveOption,
        validateQuestions,
        FORM_CONSTANTS
    };
};