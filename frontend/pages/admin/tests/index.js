import {useEffect, useState} from "react";
import ProtectedRoute from "../../../utils/ProtectedRoute";
import TestList from "../../../components/test/TestList";
import TestService from "../../../api/tests/test.service";

export default function AdminHome() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        TestService.getTests().then((tests) => setTests(tests));
    }, []);

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <TestList tests={tests}/>
        </ProtectedRoute>
    );
}