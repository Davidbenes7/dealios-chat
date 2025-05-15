import { useState } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Jsi český klient v simulovaném obchodním hovoru. Odpovídej jako reálný člověk. Občas buď skeptický, stručný, ale lidský. Nikdy neprozraď, že jsi AI.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setLoading(true);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: updatedMessages,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const reply = data.choices[0].message;
    setMessages([...updatedMessages, reply]);
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Konverzace s AI klientem</h1>
      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              padding: 10,
              marginBottom: 10,
              background:
                msg.role === "user"
                  ? "#cce5ff"
                  : msg.role === "assistant"
                  ? "#e0e0e0"
                  : "#f8f8f8",
            }}
          >
            <strong>
              {msg.role === "user"
                ? "Ty"
                : msg.role === "assistant"
                ? "Klient"
                : "System"}
              :
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zeptej se klienta..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: "black",
            color: "white",
            padding: "10px 20px",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Odeslat"}
        </button>
      </div>
    </div>
  );
}
