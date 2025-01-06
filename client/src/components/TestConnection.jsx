import React, { useEffect, useState } from "react";

const TestConnection = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the API URL based on your environment
    const apiUrl = import.meta.env.VITE_API_URL || "https://api.brckt.me";

    // Test fetch request to check backend connection
    fetch(`${apiUrl}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setStatus(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TestConnection;
