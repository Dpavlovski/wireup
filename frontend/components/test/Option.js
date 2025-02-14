export function Option({questionId, option, onSelect, answer}) {

    return (
        <label
            className={`btn btn-outline-primary btn-lg rounded-circle ${answer === option.id ? 'bg-primary text-white' : ''}`}
            style={{cursor: "pointer"}}
        >
            <input
                type="radio"
                name={`question-${questionId}`}
                value={option.id}
                checked={answer === option.id}
                onChange={() => onSelect(questionId, option.id)}
                className="d-none"
            />
            {option.value}
        </label>
    );
}
