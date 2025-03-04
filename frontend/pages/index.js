import {useAuth} from "../utils/AuthProvider";
import Link from "next/link";
import {useEffect, useState} from "react";
import ProtectedRoute from "../utils/ProtectedRoute";

/**
 * Example user home page:
 * - Displays user's name (if available).
 * - Shows a single test card with "Take Test" and "Review Tests".
 */
export default function HomePage() {
    const {user} = useAuth();
    const [assignedTest, setAssignedTest] = useState(null);

    // Example: fetch a single assigned test for this user
    useEffect(() => {
        async function fetchAssignedTest() {
            // Replace with your actual API call
            // e.g., const response = await axios.get("/api/user/assigned-test");
            // setAssignedTest(response.data);
            // For now, we'll just mock it:
            setAssignedTest({
                id: "67bb4f07e48d93070ead227a",
                title: "Test 1",
                description: "Test description",
            });
        }

        fetchAssignedTest();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <div className="container my-5">
                <h1>Welcome{user ? `, ${user.username}` : ""}!</h1>

                {assignedTest ? (
                    <div className="card shadow-sm mb-4" style={{maxWidth: "600px"}}>
                        <div className="card-body">
                            <h5 className="card-title">{assignedTest.title}</h5>
                            <p className="card-text text-secondary">
                                {assignedTest.description}
                            </p>
                            <div>
                                <Link href={`/test/${assignedTest.id}`}>
                                    <button className="btn btn-primary me-2">Take Test</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>You have no tests assigned at the moment.</p>
                )}
            </div>
        </ProtectedRoute>
    );
}
