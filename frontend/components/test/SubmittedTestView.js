import { useRouter } from "next/router";
import BackButton from "../back_button/BackButton";

export default function SubmittedTestView({ submission }) {
    const router = useRouter();

    if (!submission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Submission Found</h2>
                    <p className="text-gray-600 mb-6">The requested submission data could not be loaded.</p>
                    <BackButton onClick={() => router.back()} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-teal-800">Submission Details</h1>
                <BackButton onClick={() => router.back()} />
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-teal-50">
                <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
                    <div className="flex items-center">
                        <div className="bg-teal-100 p-2 rounded-full mr-4">
                            <svg
                                className="w-6 h-6 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-teal-800">
                                {submission.user?.username || 'Unknown User'}
                            </h2>
                            <p className="text-sm text-teal-600">
                                Submitted on: {new Date(submission.date_submitted).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-b border-teal-100">
                    <h2 className="text-xl font-semibold text-teal-800 mb-2">
                        {submission.test?.title || 'Untitled Test'}
                    </h2>
                    {submission.test?.description && (
                        <p className="text-teal-700 whitespace-pre-line">
                            {submission.test.description}
                        </p>
                    )}
                </div>

                <div className="divide-y divide-teal-100">
                    {submission.question_answer?.map((qa, index) => (
                        <div key={qa.question.id} className="p-6">
                            <div className="flex items-start">
                                <span className="bg-teal-100 text-teal-800 font-medium rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-teal-900 mb-4">
                                        {qa.question?.question || 'Question text not available'}
                                    </h3>

                                    {qa.answer ? (
                                        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                                            <div className="flex items-center">
                                                <span className="font-medium text-teal-700 mr-2">Answer:</span>
                                                <span className="text-teal-900">{qa.answer.value}</span>
                                                <span className="ml-auto text-teal-600">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-gray-500">
                                            No answer provided
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}