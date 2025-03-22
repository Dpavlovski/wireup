import {useEffect, useState} from "react";
import {copyTemplate, deleteTemplate, getTemplates} from "../../../utils/api";
import TemplateList from "../../../components/template/TemplateList";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTemplates() {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (err) {
                console.error("Error fetching templates:", err);
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
        } catch (err) {
            console.error("Error copying template:", err);
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
        return <div>Loading templates...</div>;
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
