import {useRouter} from "next/router";
import {useEffect, useState} from "react";

import ProtectedRoute from "../../../utils/ProtectedRoute";
import {useAuth} from "../../../utils/AuthProvider";
import TestService from "../../../api/tests/test.service";
import TestView from "../../../components/test/TestView";

export default function TakeTest() {
    const router = useRouter();
    const {id} = router.query;
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth()

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        TestService.getTest(id)
            .then((data) => {
                const formattedTest = {
                    ...data.test,
                    questions: data.questions.map(q => ({
                        id: q.question.id,
                        question: q.question.question,
                        options: q.options
                    }))
                };
                setTest(formattedTest);
                setLoading(false);
            })
            .catch((err) => {
                setError("Test not found");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <TestView user={user} id={test.id} title={test.title} description={test.description}
                      questions={test.questions}/>
        </ProtectedRoute>
    );
}
