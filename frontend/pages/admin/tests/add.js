import TestForm from "../../../components/test/TestForm";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function NewTest() {

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <TestForm/>
        </ProtectedRoute>
    );
}