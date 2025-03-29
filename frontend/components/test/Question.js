import Option from "./Option";

export default function Question({question, options, onSelect, answer}) {
    return (
        <div className="question-container">
            <h3 className="question-text">{question.question}</h3>
            <div className="options-grid">
                {options.map((option, index) => (
                    <Option
                        key={index}
                        questionId={question.id}
                        option={option}
                        onSelect={onSelect}
                        answer={answer}
                    />
                ))}
            </div>
        </div>
    );
}