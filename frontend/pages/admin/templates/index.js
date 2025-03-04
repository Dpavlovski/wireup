import {useEffect, useState} from "react";
import {getTemplates} from "../../../utils/api";
import TemplateList from "../../../components/template/TemplateList";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function Templates() {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        getTemplates().then((templates) => setTemplates(templates));
    }, []);

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <TemplateList templates={templates}/>
        </ProtectedRoute>
    );
}