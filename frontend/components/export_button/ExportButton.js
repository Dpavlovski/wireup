export default function ExportButton({onClick, isExporting}) {
    return (
        <button
            onClick={onClick}
            disabled={isExporting}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                isExporting
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
            } text-white transition-colors`}
        >
            {isExporting ? (
                <>
                    <svg className="animate-spin h-auto w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Export to CSV
                </>
            )}
        </button>
    );
}