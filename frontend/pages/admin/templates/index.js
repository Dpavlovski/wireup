import {useEffect, useState} from "react";
import {copyTemplate, deleteTemplate, getTemplates} from "../../../utils/api";
import TemplateList from "../../../components/template/TemplateList";
import ProtectedRoute from "../../../utils/ProtectedRoute";
import {toast} from "react-hot-toast";
import Loader from "../../../components/loader/loader";

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (err) {
                toast.error("Error fetching templates:", err.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTemplates();
    }, []);

    const handleCopy = async (id) => {
        try {
            await copyTemplate(id);
            const updatedTemplates = await getTemplates();
            setTemplates(updatedTemplates);
            toast.success("Template copied successfully!");
        } catch (err) {
           toast.error("Error copying template:", err.response.data.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTemplate(id);
            setTemplates((prev) => prev.filter((template) => template.id !== id));
        } catch (error) {
            throw error;
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <TemplateList
                templates={templates}
                handleCopy={handleCopy}
                handleDelete={handleDelete}
            />
        </ProtectedRoute>
    );
}
