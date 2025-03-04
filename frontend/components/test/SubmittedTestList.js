import Link from "next/link";
import {useRouter} from "next/router";

export function SubmittedTestList({tests}) {
    const router = useRouter();
    const {id} = router.query;

    if (!tests || tests.length === 0) return <p>No submissions available</p>;

    return (
        <div className="container mt-5">
            <h1>Submitted Tests</h1>
            <div className="list-group">
                {tests.map((submission) => (
                    <div key={submission.test.id}
                         className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{submission.user.username}</h5>
                        </div>
                        <Link href={`/admin/tests/${id}/submitted/${submission.test.id}`} passHref>
                            <button className="btn btn-info">View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}