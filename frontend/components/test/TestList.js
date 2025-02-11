import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function TestList() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            const response = await fetch("/api/tests");  // Example endpoint
            const data = await response.json();
            setTests(data);
        };

        fetchTests();
    }, []);

    return (
        <div className="container mt-5">
            <h1>All Tests</h1>
            <div className="list-group">
                {tests.length > 0 ? (
                    tests.map((test) => (
                        <div key={test.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{test.title}</h5>
                                <p>{test.description}</p>
                            </div>
                            <Link to={`/test/${test.id}`} className="btn btn-info">
                                Take Test
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No tests available</p>
                )}
            </div>
            <Link to="/create-test" className="btn btn-primary mt-4">
                Create New Test
            </Link>
        </div>
    );
}
