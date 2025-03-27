export function Option({questionId, option, onSelect, answer}) {
    const isSelected = answer === option.id;

    return (
        <label
            className={`option-button ${isSelected ? 'option-selected' : ''}`}
        >
            <input
                type="radio"
                name={`question-${questionId}`}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(questionId, option.id)}
                className="option-input"
            />
            <span className="option-value">{option.value}</span>
        </label>
    );
}