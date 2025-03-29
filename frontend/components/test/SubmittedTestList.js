import Link from "next/link";
import {useRouter} from "next/router";
import {useState} from "react";
import BackButton from "../back_button/BackButton";
import toast, {Toaster} from "react-hot-toast";
import TestService from "../../api/tests/test.service";
import ExportButton from "../export_button/ExportButton";

export default function SubmittedTestList({tests}) {
    const router = useRouter();
    const {id} = router.query;
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const itemsPerPage = 10;

    const handleBack = () => {
        router.push(`/admin/tests`);
    };

    if (!tests || tests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="bg-teal-100 p-4 rounded-full">
                    <svg
                        className="w-8 h-8 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <p className="text-gray-600 text-lg">No submissions available</p>
                <BackButton onClick={handleBack}/>
            </div>
        );
    }

    const totalPages = Math.ceil(tests.length / itemsPerPage);
    const currentItems = tests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await TestService.exportTest(id);
            const blob = new Blob([response.data], {type: "text/csv"});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `submissions_${id}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Submission was successfully exported");
        } catch (error) {
            toast.error("Error exporting test submissions: ", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-800">Submitted Tests</h1>
                <div className="flex gap-4">
                    <ExportButton onClick={handleExport} isExporting={isExporting}/>
                    <BackButton onClick={handleBack}/>
                </div>
            </div>
            <Toaster position={"bottom-right"}/>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-teal-50">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-teal-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                    Submission Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-teal-800 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((submission) => (
                                <tr key={submission.test.id} className="hover:bg-teal-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-teal-900">
                                                    {submission.user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-teal-700">
                                            {new Date(submission.test.date_submitted).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/tests/${id}/submitted/${submission.test.id}`} passHref>
                                            <button
                                                className="text-teal-600 hover:text-teal-800 mr-4 font-medium hover:underline">
                                                View Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-teal-700">
                                Showing <span
                                className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, tests.length)}
                                </span>{' '}
                                of <span className="font-medium">{tests.length}</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded-md ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 border rounded-md ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}