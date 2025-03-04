import {useEffect, useState} from "react";
import {getTests} from "../../../utils/api";
import ProtectedRoute from "../../../utils/ProtectedRoute";
import TestList from "../../../components/test/TestList";

export default function Home() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getTests().then((tests) => setTests(tests));
    }, []);

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div>
                <TestList tests={tests}/>
            </div>
        </ProtectedRoute>
    );
}