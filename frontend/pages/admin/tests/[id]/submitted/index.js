import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import ProtectedRoute from "../../../../../utils/ProtectedRoute";
import TestService from "../../../../../api/tests/test.service";
import SubmittedTestList from "../../../../../components/test/SubmittedTestList";
import {
    ErrorMessage
} from "next/dist/client/components/react-dev-overlay/ui/components/errors/error-message/error-message";
import Loader from "../../../../../components/loader/loader";

export default function TestSubmissionsPage() {
    const router = useRouter();
    const {id} = router.query;
    const [tests, setTests] = useState([]);
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const [submittedTests, testData] = await Promise.all([
                    TestService.getSubmittedTests(id, {signal: abortController.signal}),
                    TestService.getTest(id, {signal: abortController.signal})
                ]);

                setTests(submittedTests);
                setTest(testData);
                console.log(testData);
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setError(err.message || "Failed to load test data");
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [id]);

    if (!id || loading) {
        return <Loader/>;
    }

    if (error) {
        return <ErrorMessage errorMessage={error} onRetry={() => window.location.reload()}/>;
    }

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SubmittedTestList tests={tests} test={test.test}/>
        </ProtectedRoute>
    );
}