import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import SubmittedTestView from "../../../../../components/test/SubmittedTestView";
import ProtectedRoute from "../../../../../utils/ProtectedRoute";
import Loader from "../../../../../components/loader/loader";
import TestService from "../../../../../api/tests/test.service";

export default function SubmittedTest() {
    const router = useRouter();
    const {submissionId} = router.query;
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!submissionId) return;

        setLoading(true);
        TestService.getSubmittedTest(submissionId)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSubmission(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load submission");
                setLoading(false);
            });
    }, [submissionId]);

    if (loading) return <Loader/>;
    if (error) return <p>Error: {error}</p>;
    if (!submission) return <p>No submission data found</p>;

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SubmittedTestView submission={submission}/>
        </ProtectedRoute>
    );
}