import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { email, password, firstName, lastName }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          isRegister ? "Registration failed." : "Login failed."
        );
      }

      const data = await response.json();
      const resolvedUserId =
        data?.userId || data?.userID || data?.id || data?.user?.id;

      if (!resolvedUserId) {
        throw new Error("Login succeeded but no user id was returned.");
      }

      localStorage.setItem("lifebudgetUserId", resolvedUserId);
      localStorage.setItem("lifebudgetEmail", email);
      if (data?.firstName || data?.lastName) {
        localStorage.setItem(
          "lifebudgetName",
          `${data?.firstName || ""} ${data?.lastName || ""}`.trim()
        );
      }

      navigate("/app");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lb-auth">
      <div className="lb-auth-card">
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="lb-auth-subtitle">
          {isRegister
            ? "Register to start tracking your budget."
            : "Log in to continue."}
        </p>

        <form onSubmit={handleSubmit} className="lb-auth-form">
          {isRegister ? (
            <>
              <label>
                First name
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </label>
            </>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="lb-auth-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create account"
              : "Log in"}
          </button>
        </form>

        <button
          className="lb-auth-toggle"
          type="button"
          onClick={() => {
            setIsRegister((prev) => !prev);
            setError("");
          }}
        >
          {isRegister ? "Already have an account? Log in" : "New here? Register"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
