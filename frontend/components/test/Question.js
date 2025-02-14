import { Option } from "./Option";

export function Question({ question, options, onSelect, answer }) {
    return (
        <div className="mb-4">
            <h3 className="text-secondary">{question.question}</h3>
            <div className="d-flex gap-3 flex-wrap">
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

