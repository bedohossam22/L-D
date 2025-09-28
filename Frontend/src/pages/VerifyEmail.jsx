import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/auth/verify/${token}`
        );
        const data = await res.json();
        setMessage(data.message || "Something went wrong");
      } catch (err) {
        setMessage("Error: " + err.message);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
