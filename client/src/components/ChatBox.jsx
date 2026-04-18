import { useState, useEffect } from "react";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Thinking...");

  //  chats (full persistent system)
  const [chats, setChats] = useState(() => {
    return JSON.parse(localStorage.getItem("chats")) || [];
  });

  const [currentChatId, setCurrentChatId] = useState(null);

  //  save chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  //  loading animation cycle
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

  //  get current chat
  const currentChat = chats.find(c => c.id === currentChatId);

  //  format AI response
  const formatResponse = (text) => {
    const lines = text.split("\n").filter(l => l.trim() !== "");

    return {
      overview: lines.slice(0, 2).join("\n"),
      insights: lines.slice(2, 6),
    };
  };

  //  send query
  const sendQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);

    const res = await axios.post("http://localhost:5000/api/query", {
      disease: "lung cancer",
      query,
    });

    const newMessage = {
      user: query,
      bot: res.data.aiResponse,
      papers: res.data.papers,
      trials: res.data.trials,
    };

    let updatedChats;

    if (currentChatId) {
      // existing chat
      updatedChats = chats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      );
    } else {
      // new chat
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
    setLoading(false);
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-1/5 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Chats</h2>

        {/* New Chat */}
        <button
          onClick={() => setCurrentChatId(null)}
          className="bg-blue-600 w-full p-2 rounded mb-2"
        >
          + New Chat
        </button>

        {/* Clear All */}
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

        {/* Chat list */}
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer text-sm"
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-4/5 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

          <h1 className="text-2xl font-bold mb-6 text-center">
             AI Medical Assistant
          </h1>

          {currentChat?.messages.map((msg, i) => {
            const data = formatResponse(msg.bot);

            return (
              <div key={i} className="mb-6">

                {/* User */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white p-2 rounded-lg max-w-md">
                    {msg.user}
                  </div>
                </div>

                {/* AI */}
                <div className="bg-white p-4 mt-2 rounded shadow max-w-2xl">

                  <h3 className="text-blue-600 font-semibold">Overview</h3>
                  <p className="mb-3">{data.overview}</p>

                  <h3 className="text-blue-600 font-semibold">Insights</h3>
                  <ul className="list-disc pl-5 mb-3">
                    {data.insights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="text-blue-600 font-semibold">Trials</h3>
                  <ul className="list-disc pl-5 mb-3">
                    {msg.trials?.map((t, i) => (
                      <li key={i}>{t.title}</li>
                    ))}
                  </ul>

                  <h3 className="text-blue-600 font-semibold">Sources</h3>
                  <ul className="list-disc pl-5">
                    {msg.papers?.map((p, i) => (
                      <li key={i}>{p.title} ({p.year})</li>
                    ))}
                  </ul>
                </div>
                 {/* Copy */}
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.bot)}
                    className="text-xs bg-gray-200 px-2 py-1 rounded mt-2"
                  >
                    <ContentCopyIcon />
                  </button>
              </div>
            );
          })}

          {/* Loading */}
          {loading && (
            <div className="bg-white p-3 rounded shadow w-fit">
               {loadingText}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Ask about any disease..."
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