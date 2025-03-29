import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loader from "../loader/loader";
import toast from "react-hot-toast";
import BackButton from "../back_button/BackButton";
import TemplateService from "../../api/templates/template.service";
import TestService from "../../api/tests/test.service";

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
                    TemplateService.getTemplates(),
                ]);

                setTemplates(templatesData);

                if (initialData) {
                    setSelectedTemplate(initialData.template_id);
                    setSector(initialData.sector);
                    setPassword(initialData.password);
                }
            } catch (error) {
                toast.error("Failed to load templates");
            }
        };

        fetchData();
    }, [initialData, isEditMode]);

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
                await TestService.editTest(initialData.id, testData);
                toast.success("Test updated successfully!");
            } else {
                await TestService.addTest(testData);
                toast.success("Test created successfully!");
            }

            router.push("/admin/tests");
        } catch (error) {
            toast.error(error.response?.data?.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push("/admin/tests");
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-teal-700">
                {isEditMode ? "Edit Test" : "Create New Test"}
            </h1>
            <BackButton onClick={handleBack}/>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-teal-50">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="template" className="block text-sm font-medium text-teal-700 mb-2">
                        Template {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <select
                        id="template"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        required
                    >
                        {!isEditMode && (
                            <option value="" className="text-gray-400">Select a template</option>
                        )}
                        {templates.map((template) => (
                            <option
                                key={template.id}
                                value={template.id}
                                className="text-gray-700"
                            >
                                {template.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sector" className="block text-sm font-medium text-teal-700 mb-2">
                        Sector <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Enter sector"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-teal-700 mb-2">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader className="h-5 w-5 text-white"/>
                        ) : (
                            isEditMode ? "Save Changes" : "Create Test"
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
}