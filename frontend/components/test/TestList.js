import Link from "next/link";


export function TestList({tests}) {

    if (tests.length === 0) return <p>No tests available</p>;

    return (
        <div className="container mt-5">
            <h1>All Tests</h1>
            <div className="list-group">
                {tests.map((test) => (
                    <div key={test.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{test.title}</h5>
                            <p>{test.description}</p>
                        </div>
                        <Link href={`/test/${test.id}`}>
                            <button className="btn btn-info">Take Test</button>
                        </Link>
                        <Link href={`/test/${test.id}/submitted`}>
                            <button className="btn btn-info">Review Tests</button>
                        </Link>
                    </div>
                ))}

            </div>
            <Link href={`/test/add`}>
                <button className="btn btn-info">Create Test</button>
            </Link>
        </div>
    );
}
