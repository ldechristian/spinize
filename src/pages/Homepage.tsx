import { useEffect, useState } from "react";
import { saveCredentials } from "../lib/credentials";
import { MD5 } from "crypto-js";
import { Link, useNavigate } from "react-router-dom";
import { generateSalt } from "../utils/generateSalt";
import { normalizeUrl } from "../utils/normalizeUrl";
import useAuth from "../hooks/useAuth";

type Method = "http" | "https";

export default function Homepage() {
  const { authenticated } = useAuth(); // FIXED

  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/app", { replace: true }); // FIXED
    }
  }, [authenticated, navigate]);

  const [serverDomain, setServerDomain] = useState("");
  const [method, setMethod] = useState<Method>("https");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const serverUrl = `${method}://${serverDomain}`;

      try {
        new URL(serverUrl);
      } catch {
        setMessage("Invalid URL");
        return;
      }

      const normalizedUrl = normalizeUrl(serverUrl);

      const salt = generateSalt();
      const token = MD5(password + salt).toString();

      await saveCredentials({
        url: normalizedUrl,
        username,
        token,
        salt,
      });

      await fetch(normalizedUrl).catch(() => {
        throw new Error("Network error");
      });

      navigate("/app");

    } catch {
      setMessage("Error saving credentials or connecting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative text-white bg-stone-900 px-2 md:px-4 lg:px-8 xl:px-12 overflow-y-scroll h-[100vh]">

      <Link to="/about" className="mx-auto w-full max-w-4xl p-4 block">
        About the Spinize project
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-2 md:p-4 rounded-md border-2 border-color-600 text-black mx-auto w-full max-w-4xl my-12"
      >
        <label className="text-700 font-semibold">
          Protocol - <i>HTTP or HTTPS</i>
        </label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
          className="p-2 rounded-md border-2 border-color-600 focus:outline-4 outline-color-800 bg-black text-white"
        >
          <option value="http">HTTP</option>
          <option value="https">HTTPS (more secure)</option>
        </select>

        <label className="text-700 font-semibold">
          Server Domain
        </label>

        <input
          className="p-2 rounded-md border-2 border-color-600 focus:outline-4 outline-color-800 bg-black text-white"
          type="text"
          value={serverDomain}
          onChange={(e) => setServerDomain(e.target.value)}
          placeholder="mysubsonicserver.domain"
          required
        />

        <label className="text-700 font-semibold">Username</label>
        <input
          className="p-2 rounded-md border-2 border-color-600 focus:outline-4 outline-color-800 bg-black text-white"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="text-700 font-semibold">Password</label>
        <input
          className="p-2 rounded-md border-2 border-color-600 focus:outline-4 outline-color-800 bg-black text-white"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 p-2 rounded-md bg-600 border-2 border-color-600 focus:outline-4 outline-color-800 uppercase text-white tracking-wider"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            color: "red",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </p>
      )}
    </main>
  );
}