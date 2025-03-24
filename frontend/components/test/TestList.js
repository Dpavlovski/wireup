import Link from "next/link";
import {useEffect, useState} from "react";
import {activateTest, checkTestSubmissions, deleteTest} from "../../utils/api";
import DeleteButton from "../DeleteButton/DeleteButton";

export default function TestList({tests: initialTests}) {
    const [localTests, setLocalTests] = useState(initialTests);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSector, setSelectedSector] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [testsPerPage] = useState(10);
    const [loadingId, setLoadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [submissionChecks, setSubmissionChecks] = useState({});

    useEffect(() => {
        const checkSubmissions = async () => {
            const checks = {};
            for (const test of initialTests) {
                const hasSubmissions = await checkTestSubmissions(test.id);
                checks[test.id] = hasSubmissions;
            }
            setSubmissionChecks(checks);
            setLocalTests(initialTests);
        };
        checkSubmissions();
    }, [initialTests]);

    const sectors = [...new Set(localTests.map((test) => test.sector))];

    const filteredTests = localTests.filter((test) => {
        const matchesSector = selectedSector === "all" || test.sector === selectedSector;
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSector && matchesSearch;
    });

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);
    const totalPages = Math.ceil(filteredTests.length / testsPerPage);

    const handleActivate = async (id) => {
        try {
            setLoadingId(id);
            await activateTest(id);

            setLocalTests(prevTests =>
                prevTests.map(test =>
                    test.id === id ? {...test, is_active: !test.is_active} : test
                )
            );
        } catch (error) {
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) return;

        try {
            setDeletingId(id);
            await deleteTest(id);
            setLocalTests(prev => prev.filter(test => test.id !== id));
        } catch (error) {
            alert(error.response?.data?.detail || "Could not delete test");
        } finally {
            setDeletingId(null);
        }
    };

    if (localTests.length === 0) {
        return (
            <div className="mt-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full">
                    <svg
                        className="w-12 h-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">No tests found</h3>
                    <p className="text-gray-600 max-w-md">
                        There are currently no tests available. Get started by creating a new test.
                    </p>
                </div>
                <Link
                    href="/admin/tests/add"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Create First Test
                    <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">All Tests</h1>
                <Link
                    href="/admin/tests/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Create Test
                </Link>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-4 py-2 border rounded-md text-sm"
                >
                    <option value="all">All Sectors</option>
                    {sectors.map((sector) => (
                        <option key={sector} value={sector}>
                            {sector}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-md text-sm flex-grow"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["#", "Sector", "Title", "Date Created", "Password", "Active", "Actions"].map(
                            (header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            )
                        )}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentTests.map((test, index) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {index + 1 + (currentPage - 1) * testsPerPage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {test.sector}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {test.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(test.date_created).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                {test.password}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={test.is_active}
                                        onChange={() => handleActivate(test.id)}
                                        disabled={loadingId === test.id}
                                        className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                                            loadingId === test.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                    />
                                    {loadingId === test.id && (
                                        <span className="ml-2 text-gray-500 text-sm">Updating...</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                <Link
                                    href={`/admin/tests/${test.id}/submitted`}
                                    className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                >
                                    Review
                                </Link>
                                {!submissionChecks[test.id] ? (
                                    <>
                                        <Link
                                            href={`/admin/tests/edit/${test.id}`}
                                            className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md text-sm hover:bg-green-200 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <DeleteButton handleDelete={() => handleDelete(test.id)}/>
                                    </>
                                ) : (
                                    <span className="text-gray-500 text-sm">Edits blocked (has submissions)</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing {indexOfFirstTest + 1} to {Math.min(indexOfLastTest, filteredTests.length)} of{" "}
                    {filteredTests.length} results
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm rounded-md ${
                            currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm rounded-md ${
                            currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}