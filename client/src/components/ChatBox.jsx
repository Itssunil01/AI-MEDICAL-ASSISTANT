import { useState, useEffect } from "react";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Thinking...");

  const [chats, setChats] = useState(() => {
    return JSON.parse(localStorage.getItem("chats")) || [];
  });

  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // 🔄 Loading animation
  useEffect(() => {
    if (!loading) return;

    const steps = [
      "Thinking...",
      "Searching research...",
      "Fetching trials...",
      "Analyzing data...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setLoadingText(steps[i]);
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  const currentChat = chats.find((c) => c.id === currentChatId);

  // 🧠 SMART PARSER (ROBUST)
  const formatResponse = (text) => {
    const sections = {
      about: "",
      causes: [],
      prevention: [],
    };

    let current = "";

    text.split("\n").forEach((line) => {
      const l = line.toLowerCase().trim();

      if (l.includes("about")) current = "about";
      else if (l.includes("cause")) current = "causes";
      else if (l.includes("prevention")) current = "prevention";
      else {
        if (!line.trim()) return;

        if (current === "about") sections.about += line + " ";
        else if (current === "causes")
          sections.causes.push(line.replace("- ", ""));
        else if (current === "prevention")
          sections.prevention.push(line.replace("- ", ""));
      }
    });

    return sections;
  };

  // 📤 SEND QUERY
  const sendQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "https://ai-medical-assistant-7jb2.onrender.com/api/query",
        { query }
      );

      const newMessage = {
        user: query,
        bot: res.data.aiResponse,
        papers: res.data.papers,
        trials: res.data.trials,
      };

      let updatedChats;

      if (currentChatId) {
        updatedChats = chats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        );
      } else {
        const newChat = {
          id: Date.now(),
          title: query,
          messages: [newMessage],
        };

        updatedChats = [...chats, newChat];
        setCurrentChatId(newChat.id);
      }

      setChats(updatedChats);
      setQuery("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-4">CuraLink</h2>

        <button
          onClick={() => setCurrentChatId(null)}
          className="bg-blue-600 w-full p-2 rounded mb-2"
        >
          + New Chat
        </button>

        <button
          onClick={() => {
            setChats([]);
            setCurrentChatId(null);
            localStorage.clear();
          }}
          className="bg-red-500 w-full p-2 rounded mb-4"
        >
          🗑 Clear All
        </button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer text-sm"
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="w-4/5 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-center">
            AI Medical Assistant
          </h1>

          {currentChat?.messages.map((msg, i) => {
            const data = formatResponse(msg.bot);

            return (
              <div key={i} className="mb-6">
                {/* USER */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white p-2 rounded-lg max-w-md">
                    {msg.user}
                  </div>
                </div>

                {/* AI */}
                <div className="bg-white p-5 mt-2 rounded-xl shadow max-w-3xl">
                  {/* ABOUT */}
                  <h3 className="text-blue-600 font-semibold">
                    🧠 About Disease
                  </h3>
                  <p className="mb-3 text-sm">
                    {data.about || "General medical information about the disease is provided."}
                  </p>

                  {/* CAUSES */}
                  <h3 className="text-red-500 font-semibold">Causes</h3>
                  {data.causes.length > 0 ? (
                    <ul className="list-disc pl-5 mb-3 text-sm">
                      {data.causes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm mb-3">
                      Causes data not available
                    </p>
                  )}

                  {/* PREVENTION */}
                  <h3 className="text-green-600 font-semibold">
                    Prevention
                  </h3>
                  {data.prevention.length > 0 ? (
                    <ul className="list-disc pl-5 mb-3 text-sm">
                      {data.prevention.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm mb-3">
                      Prevention data not available
                    </p>
                  )}

                  {/* TRIALS */}
                  <h3 className="text-purple-600 font-semibold">
                    Clinical Trials
                  </h3>
                  <ul className="list-disc pl-5 mb-3 text-sm">
                    {msg.trials?.map((t, i) => (
                      <li key={i}>{t.title}</li>
                    ))}
                  </ul>

                  {/* PUBLICATIONS */}
                  <h3 className="text-indigo-600 font-semibold">
                    Research Publications
                  </h3>
                  <ul className="list-disc pl-5 text-sm">
                    {msg.papers?.map((p, i) => (
                      <li key={i}>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {p.title}
                        </a>{" "}
                        ({p.year})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* COPY */}
                <button
                  onClick={() => navigator.clipboard.writeText(msg.bot)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded mt-2"
                >
                  <ContentCopyIcon />
                </button>
              </div>
            );
          })}

          {/* LOADING */}
          {loading && (
            <div className="bg-white p-3 rounded shadow w-fit">
              {loadingText}
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Ask about disease (e.g., diabetes causes)"
          />
          <button
            onClick={sendQuery}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;