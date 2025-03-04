import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {addTest, getTemplates} from "../../utils/api";

export default function TestForm() {
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [sector, setSector] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (error) {
                console.error("Error fetching templates:", error);
            }
        };
        fetchTemplates().then();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedTemplate) {
            alert("Please select a template.");
            return;
        }
        if (!sector.trim() || !password.trim()) {
            alert("Sector and Password are required.");
            return;
        }
        const newTest = {template_id: selectedTemplate, sector: sector, password: password};
        await addTest(newTest);
        router.push("/admin/tests");
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Create Test from Template</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="template" className="form-label">
                        Select Template *
                    </label>
                    <select
                        id="template"
                        className="form-select"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a Template --</option>
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
                <button type="submit" className="btn btn-primary">
                    Create Test
                </button>
            </form>
        </div>
    );
}
