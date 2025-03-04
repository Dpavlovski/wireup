import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getSubmittedTest} from "../../../../../utils/api";
import SubmittedTestView from "../../../../../components/test/SubmittedTestView";
import ProtectedRoute from "../../../../../utils/ProtectedRoute";

export default function SubmittedTest() {
    const router = useRouter();
    const {submissionId} = router.query;
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!submissionId) return;

        setLoading(true);
        getSubmittedTest(submissionId)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSubmission(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching submission:", err);
                setError("Failed to load submission");
                setLoading(false);
            });
    }, [submissionId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!submission) return <p>No submission data found</p>;

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SubmittedTestView submission={submission}/>
        </ProtectedRoute>
    );
}