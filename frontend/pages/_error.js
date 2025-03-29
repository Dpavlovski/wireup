function Error({ statusCode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">
                    {statusCode || 'Error'}
                </h1>
                <p className="text-2xl text-gray-800 mb-4">
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'An error occurred on client'}
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Return Home
                </a>
            </div>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error