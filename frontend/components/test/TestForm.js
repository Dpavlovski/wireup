import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {addTest, editTest, getTemplates} from "../../utils/api";

export default function TestForm({initialData}) {
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [sector, setSector] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isEditMode = !!initialData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [templatesData] = await Promise.all([
                    getTemplates(),
                ]);

                setTemplates(templatesData);

                if (initialData) {
                    setSelectedTemplate(initialData.template_id);
                    setSector(initialData.sector);
                    setPassword(initialData.password);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [initialData?.id, isEditMode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const testData = {
                template_id: selectedTemplate,
                sector: sector.trim(),
                password: password.trim()
            };

            if (isEditMode) {
                await editTest(initialData.id, testData);
            } else {
                await addTest(testData);
            }

            router.push("/admin/tests");
        } catch (error) {
            console.error("Form submission failed:", error);
            alert(error.response?.data?.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{isEditMode ? "Edit Test" : "Create Test from Template"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="template" className="form-label">
                        Template {!isEditMode && "*"}
                    </label>
                    <select
                        id="template"
                        className="form-select"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        required
                    >
                        {!isEditMode && (
                            <option value="">-- Choose a Template --</option>
                        )}
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="sector" className="form-label">
                        Sector *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Enter sector"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password *
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Create Test")}
                </button>
            </form>
        </div>
    );
}