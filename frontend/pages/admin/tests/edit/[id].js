import {useRouter} from "next/router";
import {getEditTest} from "../../../../utils/api";
import {useEffect, useState} from "react";
import ProtectedRoute from "../../../../utils/ProtectedRoute";
import TestForm from "../../../../components/test/TestForm";

export default function EditTest() {
    const router = useRouter();
    const {id} = router.query;
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        if (id) {
            getEditTest(id)
                .then(setTestData)
                .catch(console.error);
        }
    }, [id]);

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            {testData ? (
                <TestForm initialData={testData}/>
            ) : (
                <div className="container mt-5">Loading test data...</div>
            )}
        </ProtectedRoute>
    );
}