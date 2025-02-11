export function Option({questionId, option, onSelect, answer}) {

    return (
        <label
            className={`btn btn-outline-primary btn-lg rounded-circle ${answer === option ? 'bg-primary text-white' : ''}`}
            style={{cursor: "pointer"}}
        >
            <input
                type="radio"
                name={`question-${questionId}`}
                value={option}
                checked={answer === option}
                onChange={() => onSelect(questionId, option)}
                className="d-none"
            />
            {option}
        </label>
    );
}
