import { Option } from "./Option";

export function Question({ questionId, question, options, onSelect, answer }) {
    return (
        <div className="mb-4">
            <h3 className="text-secondary">{question}</h3>
            <div className="d-flex gap-3 flex-wrap">
                {options.map((option, index) => (
                    <Option
                        key={index}
                        questionId={questionId}
                        option={option.value}
                        onSelect={onSelect}
                        answer={answer}
                    />
                ))}
            </div>
        </div>
    );
}

