import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import ProtectedRoute from "../../../../../utils/ProtectedRoute";
import TestService from "../../../../../api/tests/test.service";
import SubmittedTestList from "../../../../../components/test/SubmittedTestList";

export default function Home() {
    const router = useRouter();
    const {id} = router.query;
    const [tests, setTests] = useState([]);

    useEffect(() => {
        TestService.getSubmittedTests(id).then((tests) => setTests(tests));
    }, [id]);

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SubmittedTestList tests={tests}/>
        </ProtectedRoute>
    );
}