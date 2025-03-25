export default function AddButton({text}) {
    return (<button className="add-button">
            <svg
                aria-hidden="true"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="add-button-svg"
            >
                <path
                    strokeWidth="2"
                    stroke="#fffffff"
                    d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                ></path>
                <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    stroke="#fffffff"
                    d="M17 15V18M17 21V18M17 18H14M17 18H20"
                ></path>
            </svg>
            {text}
        </button>
    );
}