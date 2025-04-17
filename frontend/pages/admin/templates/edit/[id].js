import ProtectedRoute from "../../../../utils/ProtectedRoute";
import TemplateForm from "../../../../components/template/TemplateForm";
import {useTemplateData} from "../../../../hooks/useTemplateData";
import Loader from "../../../../components/loader/loader";

const EditTemplate = () => {
    const {loading, error, test} = useTemplateData();

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            {loading && <Loader/>}

            {!loading && !error && test && (
                <TemplateForm initialData={test}/>
            )}
        </ProtectedRoute>
    );
};

export default EditTemplate;