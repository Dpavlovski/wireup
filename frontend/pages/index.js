import {useAuth} from "../utils/AuthProvider";
import {useEffect, useState} from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import {ChartBarIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline";
import {LockClosedIcon, XCircleIcon} from "@heroicons/react/16/solid";
import {getActiveTests, getSubmittedTemplatesByUser, getSubmittedTestsByUser} from "../utils/api";
import {useRouter} from "next/router";

export default function HomePage() {
    const {user} = useAuth();
    const router = useRouter();
    const [activeTests, setActiveTests] = useState([]);
    const [completedTests, setCompletedTests] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [tests, completed] = await Promise.all([
                    getActiveTests(),
                    getSubmittedTemplatesByUser(user.id)
                ]);
                setActiveTests(tests);
                setCompletedTests(completed);
                console.log(completed);
            } catch (error) {
                console.error("Error fetching data:", error);
                setActiveTests([]);
                setCompletedTests([]);
            }
        }

        if (user) fetchData();
    }, [user]);

    const isTestCompleted = (testId) => completedTests.includes(testId);

    const handleStartTest = (test) => {
        if (isTestCompleted(test.template_id)) {
            return;
        }

        if (test.password) {
            setSelectedTest(test);
            setShowPasswordModal(true);
        } else {
            router.push(`/test/${test.id}`);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (enteredPassword === selectedTest.password) {
            router.push(`/test/${selectedTest.id}`);
        } else {
            setErrorMessage("Incorrect password. Please try again.");
        }
        setEnteredPassword("");
    };

    const hasActiveTests = activeTests.length > 0;

    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600"/>
                            Welcome{user ? `, ${user.username}` : ""}!
                        </h1>
                        <p className="mt-2 text-gray-600">Your opinion matters - thank you for contributing!</p>
                    </div>
                </div>

                {hasActiveTests ? (
                    activeTests.map((test) => (
                        <div key={test.id}
                             className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mb-6">
                            <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <ChartBarIcon className="w-6 h-6 text-blue-600"/>
                                    {test.title}
                                    {isTestCompleted(test.template_id) && (
                                        <span
                                            className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        Completed
                                    </span>
                                    )}
                                </h2>
                            </div>

                            <div className="px-6 py-5">
                                <p className="text-gray-600 mb-4">{test.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                                        <p className="text-gray-900 font-semibold">
                                            5 minutes
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">Questions</p>
                                        <p className="text-gray-900 font-semibold">
                                            {test.total_questions}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {isTestCompleted(test.template_id) ? (
                                        <button
                                            disabled
                                            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                                        >
                                            Already Completed
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStartTest(test)}
                                            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            Start Survey
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                        <p className="text-gray-600 mb-2">No active surveys available at the moment</p>
                        <p className="text-sm text-gray-500">Check back later for new surveys</p>
                    </div>
                )}

                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <XCircleIcon className="w-6 h-6"/>
                            </button>

                            <h3 className="text-xl font-semibold mb-4">Enter Survey Password</h3>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        value={enteredPassword}
                                        onChange={(e) => {
                                            setEnteredPassword(e.target.value);
                                            setErrorMessage("");
                                        }}
                                        placeholder="Enter survey password"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {errorMessage && (
                                    <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
                                )}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="mt-8 max-w-3xl text-center">
                    <p className="text-sm text-gray-500">
                        <LockClosedIcon className="w-4 h-4 inline-block mr-1"/>
                        Your responses are securely stored and protected by our privacy policy
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}