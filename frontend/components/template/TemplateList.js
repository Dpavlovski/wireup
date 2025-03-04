import React, {useEffect, useState} from "react";
import Link from "next/link";
import {getTemplates} from "../../utils/api";

export default function TemplatesList() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates().then();
    }, []);

    const fetchTemplates = async () => {
        try {
            const data = await getTemplates();
            setTemplates(data);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (templateId) => {
    //     if (confirm("Are you sure you want to delete this template?")) {
    //         try {
    //             await deleteTemplate(templateId);
    //             fetchTemplates().then();
    //         } catch (error) {
    //             console.error("Error deleting template:", error);
    //         }
    //     }
    // };

    if (loading) {
        return <div>Loading templates...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Test Templates</h1>
            <div className="mb-3">
                <Link href="/admin/templates/add">
                    <button className="btn btn-primary">Create New Template</button>
                </Link>
            </div>
            {templates.length === 0 ? (
                <p>No templates found.</p>
            ) : (
                <div className="row">
                    {templates.map((template) => (
                        <div key={template.id} className="col-md-4 mb-3">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{template.title}</h5>
                                    <p className="card-text flex-grow-1">{template.description}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Created: {new Date(template.date_created).toLocaleDateString()}
                                        </small>
                                    </p>
                                    {/*<div className="d-flex justify-content-between">*/}
                                    {/*    <Link href={`/tests/templates/edit/${template.id}`}>*/}
                                    {/*        <a className="btn btn-secondary btn-sm">Edit</a>*/}
                                    {/*    </Link>*/}
                                    {/*    <button*/}
                                    {/*        className="btn btn-danger btn-sm"*/}
                                    {/*        onClick={() => handleDelete(template.id)}*/}
                                    {/*    >*/}
                                    {/*        Delete*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4">
                <Link href="/test">
                    <button className="btn btn-secondary">Back to Tests</button>
                </Link>
            </div>
        </div>
    );
}
