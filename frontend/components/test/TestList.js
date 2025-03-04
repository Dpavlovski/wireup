import Link from "next/link";

export default function TestList({tests}) {
    if (tests.length === 0) return <p>No tests available</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>All Tests</h1>
                <Link href="/admin/tests/add" legacyBehavior>
                    <a className="btn btn-primary">Create Test</a>
                </Link>
            </div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Title</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Password</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {tests.map((test, index) => (
                    <tr key={test.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{test.sector}</td>
                        <td>{test.title}</td>
                        <td>{new Date(test.date_created).toLocaleDateString()}</td>
                        <td>{test.password}</td>
                        <td>
                            {/*<Link href={`/admin/tests/${test.id}/edit`} legacyBehavior>*/}
                            {/*    <a className="btn btn-sm btn-warning me-2">Edit</a>*/}
                            {/*</Link>*/}
                            <Link href={`/admin/tests/${test.id}/submitted`}>
                                <button className="btn btn-sm btn-info me-2">Review</button>
                            </Link>
                            {/*<button className="btn btn-sm btn-danger">Delete</button>*/}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
