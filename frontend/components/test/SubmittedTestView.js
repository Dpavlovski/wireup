import {useRouter} from "next/router";

export default function SubmittedTestView({submission}) {
    const router = useRouter();

    if (!submission) {
        return (
            <div className="container mt-5 p-4 text-center">
                <div className="alert alert-danger">No submission data found</div>
                <button
                    className="btn btn-secondary mt-3"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5 p-4 border rounded shadow-lg bg-light">
            <header className="text-center mb-5">
                <h1 className="text-primary mb-3">Submission Details</h1>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    User: {submission.user?.username || 'Unknown'}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="mb-5">
                <div className="text-center mb-4">
                    <h2 className="text-secondary">{submission.test?.title || 'Untitled Test'}</h2>
                    {submission.test?.description && (
                        <p className="lead text-muted">{submission.test.description}</p>
                    )}
                </div>

                <ol className="list-group list-group-numbered">
                    {submission.question_answer?.map((qa) => (
                        <li
                            key={qa.question.id}
                            className="list-group-item mb-3"
                        >
                            <div className="ms-3">
                                <h4 className="mb-3 text-dark">
                                    {qa.question?.question || 'Question text not available'}
                                </h4>

                                {qa.answer ? (
                                    <div>
                                        <strong>Your Answer:</strong> {qa.answer.value}
                                        <span className="ms-2">
                                                <i className="bi bi-check-circle-fill"></i>
                                        </span>

                                    </div>
                                ) : (
                                    <div className="alert alert-warning">
                                        No answer provided
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="text-center">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Submissions
                </button>
            </div>
        </div>
    );
}