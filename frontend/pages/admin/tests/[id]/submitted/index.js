import {useEffect, useState} from "react";
import {SubmittedTestList} from "../../../../../components/test/SubmittedTestList";
import {getSubmittedTests} from "../../../../../utils/api";
import {useRouter} from "next/router";
import ProtectedRoute from "../../../../../utils/ProtectedRoute";

export default function Home() {
    const router = useRouter();
    const {id} = router.query;
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getSubmittedTests(id).then((tests) => setTests(tests));
    }, [id]);

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SubmittedTestList tests={tests}/>
        </ProtectedRoute>
    );
}