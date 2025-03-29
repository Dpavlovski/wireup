import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ProtectedRoute from "../../../../utils/ProtectedRoute";
import TestForm from "../../../../components/test/TestForm";
import TestService from "../../../../api/tests/test.service";

export default function EditTest() {
    const router = useRouter();
    const {id} = router.query;
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        if (id) {
            TestService.getEditTest(id)
                .then(setTestData)
                .catch();
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