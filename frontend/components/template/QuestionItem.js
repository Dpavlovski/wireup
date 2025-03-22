import React from "react";

const QuestionItem = ({
                          totalQuestions,
                          question,
                          qIndex,
                          isPreview,
                          isEditing,
                          isDisabled,
                          MIN_OPTIONS,
                          handleQuestionChange,
                          handleRemoveQuestion,
                          handleOptionChange,
                          handleAddOption,
                          handleRemoveOption
                      }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Question {qIndex + 1}
        </span>
                {/* Use totalQuestions instead of questions.length */}
                {(isEditing || !isPreview) && totalQuestions > 1 && (
                    <button
                        type="button"
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        onClick={() => handleRemoveQuestion(qIndex)}
                    >
                        Remove Question
                    </button>
                )}
            </div>

            {(isEditing || !isPreview) && (
                <button
                    type="button"
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => handleAddOption(qIndex)}
                    disabled={isDisabled}
                >
                    + Add Option
                </button>
            )}
        </div>
    );
};

export default QuestionItem;