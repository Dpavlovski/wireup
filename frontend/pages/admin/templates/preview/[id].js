import ProtectedRoute from "../../../../utils/ProtectedRoute";
import TemplateForm from "../../../../components/template/TemplateForm";
import {useTemplateData} from "../../../../hooks/useTemplateData";
import {router} from "next/client";

const PreviewTemplate = () => {
    const {loading, error, test} = useTemplateData();

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            {error && (
                <div className="p-4 text-red-600 bg-red-50">
                    {error} - <button onClick={() => router.back()}>Go back</button>
                </div>
            )}

            {loading && <div className="p-4 text-gray-600">Loading template...</div>}

            {!loading && !error && test && (
                <TemplateForm isPreview={true} initialData={test}/>
            )}
        </ProtectedRoute>
    );
};

export default PreviewTemplate;