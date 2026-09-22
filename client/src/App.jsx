import { useState, useEffect } from "react";
import { Copy, Check, Link, ArrowRight, Loader2 } from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
    const [url, setUrl] = useState("");
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(null);

    const fetchUrls = async () => {
        try {
            const response = await fetch(`${API_URL}/urls`);

            if (response.ok) {
                const data = await response.json();
                setUrls([...data].reverse());
            }
        } catch (err) {
            console.error("Failed to fetch URLs", err);
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleShorten = async (e) => {
        e.preventDefault();

        if (!url) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/shorten`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to shorten URL");
            }

            setUrl("");
            fetchUrls();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (shortCode) => {
        const shortUrl = `${API_URL}/${shortCode}`;

        navigator.clipboard.writeText(shortUrl);

        setCopied(shortCode);

        setTimeout(() => {
            setCopied(null);
        }, 2000);
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <Link className="brand-icon" size={28} />
                    <h2>Shortly</h2>
                </div>
            </nav>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1>
                            Turn Long URLs into{" "}
                            <span className="highlight">Short Links</span>
                        </h1>

                        <p>
                            Streamline your links. Expand your reach. Big
                            possibilities in small packages.
                        </p>

                        <form
                            className="shorten-form"
                            onSubmit={handleShorten}
                        >
                            <div className="input-group">
                                <Link className="input-icon" size={20} />

                                <input
                                    type="url"
                                    placeholder="Paste your long URL here (e.g., https://example.com)"
                                    value={url}
                                    onChange={(e) =>
                                        setUrl(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            className="spinner"
                                            size={20}
                                        />
                                        Shortening...
                                    </>
                                ) : (
                                    <>
                                        Shorten
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </section>

                <section className="recent-links">
                    <h2>Recent Links</h2>

                    {urls.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                No links shortened yet. Try one above!
                            </p>
                        </div>
                    ) : (
                        <div className="links-grid">
                            {urls.map((item) => (
                                <div
                                    key={item.shortCode}
                                    className="link-card"
                                >
                                    <div className="link-info">
                                        <div
                                            className="original-url"
                                            title={item.originalUrl}
                                        >
                                            {item.originalUrl}
                                        </div>

                                        <a
                                            href={`${API_URL}/${item.shortCode}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="short-url"
                                        >
                                            localhost:3000/
                                            {item.shortCode}
                                        </a>

                                        <div className="stats">
                                            <span className="hits">
                                                {item.hits}{" "}
                                                {item.hits === 1
                                                    ? "click"
                                                    : "clicks"}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                item.shortCode
                                            )
                                        }
                                        className={`copy-btn ${copied === item.shortCode
                                                ? "copied"
                                                : ""
                                            }`}
                                        title="Copy to clipboard"
                                    >
                                        {copied === item.shortCode ? (
                                            <Check size={18} />
                                        ) : (
                                            <Copy size={18} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;