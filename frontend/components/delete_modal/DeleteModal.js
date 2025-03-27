import {Button, Modal} from "react-bootstrap";

export default function DeleteModal({selectedElement, name, closeDeleteModal, confirmDelete}) {
    return (
        <Modal show={!!selectedElement} onHide={closeDeleteModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-gray-600">
                    Are you sure you want to delete
                    {selectedElement ? ` "${name}"` : ""}? This action cannot be undone.
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
    );
}