import Link from "next/link";
import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import toast, {Toaster} from "react-hot-toast";
import DeleteButton from "../DeleteButton/DeleteButton";
import CopyButton from "../copy_button/CopyButton";
import AddButton from "../add_button/AddButton";

export default function TemplatesList({templates, handleCopy, handleDelete}) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const openDeleteModal = (template) => {
        setSelectedTemplate(template);
    };

    const closeDeleteModal = () => {
        setSelectedTemplate(null);
    };

    const confirmDelete = async () => {
        if (!selectedTemplate) return;
        try {
            await handleDelete(selectedTemplate.id);
            toast.success("Template deleted successfully");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data?.detail || "Cannot delete template due to existing references.");
            } else {
                toast.error(error.response?.data?.detail || "An error occurred while deleting the template.");
            }
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Toaster position="bottom-right"/>

            <Modal show={!!selectedTemplate} onHide={closeDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-gray-600">
                        Are you sure you want to delete the template
                        {selectedTemplate ? ` "${selectedTemplate.title}"` : ""}? This action cannot be undone.
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Test Templates</h1>

                <Link href="/admin/templates/add" className="text-decoration-none">
                    <AddButton text={"CREATE NEW TEMPLATE"}/>
                </Link>
            </div>

            {templates.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No templates found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{template.description}</p>
                                    <div className="text-sm text-gray-500 mb-4">
                                        Created: {new Date(template.date_created).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <Link
                                        href={`/admin/templates/preview/${template.id}`}
                                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                                    >
                                        Preview
                                    </Link>

                                    <div className="flex gap-2">
                                        <CopyButton handleCopy={() => handleCopy(template.id)}/>
                                        <DeleteButton handleDelete={() => openDeleteModal(template)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
