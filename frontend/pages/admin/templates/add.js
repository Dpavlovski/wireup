import TemplateForm from "../../../components/template/TemplateForm";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function NewTemplate() {

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <TemplateForm/>
        </ProtectedRoute>
    );
}