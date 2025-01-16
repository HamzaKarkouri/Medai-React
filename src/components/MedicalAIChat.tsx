import React, { useState, useEffect, useRef } from "react";
import { Bot, X } from "lucide-react";

// Définir le type pour un message
interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const MedicalAIChat: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // Liste des spécialités médicales en différentes langues
    const medicalSpecialists = [
        { en: "general practitioner", fr: "médecin généraliste", ar: "طبيب عام", darija: "طبيب عام" },
        { en: "cardiologist", fr: "cardiologue", ar: "طبيب القلب", darija: "طبيب ديال القلب" },
        { en: "neurologist", fr: "neurologue", ar: "طبيب الأعصاب", darija: "طبيب ديال الأعصاب" },
        { en: "dermatologist", fr: "dermatologue", ar: "طبيب الجلد", darija: "طبيب ديال الجلد" },
        { en: "gastroenterologist", fr: "gastro-entérologue", ar: "طبيب الجهاز الهضمي", darija: "طبيب ديال المصران" },
        { en: "pediatrician", fr: "pédiatre", ar: "طبيب الأطفال", darija: "طبيب ديال الدراري" },
        { en: "psychiatrist", fr: "psychiatre", ar: "طبيب نفسي", darija: "طبيب ديال النفسية" },
        { en: "dentist", fr: "dentiste", ar: "طبيب الأسنان", darija: "طبيب ديال السنان" },
        { en: "orthopedist", fr: "orthopédiste", ar: "طبيب العظام", darija: "طبيب ديال العظام" },
        { en: "urologist", fr: "urologue", ar: "طبيب المسالك البولية", darija: "طبيب ديال البول" },
        { en: "gynecologist", fr: "gynécologue", ar: "طبيب النساء", darija: "طبيب ديال العيالات" },
        { en: "endocrinologist", fr: "endocrinologue", ar: "طبيب الغدد الصماء", darija: "طبيب ديال الغدد" },
        { en: "ophthalmologist", fr: "ophtalmologue", ar: "طبيب العيون", darija: "طبيب ديال العينين" },
        { en: "pulmonologist", fr: "pneumologue", ar: "طبيب الرئة", darija: "طبيب ديال الرئة" },
        { en: "oncologist", fr: "oncologue", ar: "طبيب الأورام", darija: "طبيب ديال السرطان" },
        { en: "hematologist", fr: "hématologue", ar: "طبيب الدم", darija: "طبيب ديال الدم" },
        { en: "rheumatologist", fr: "rhumatologue", ar: "طبيب الروماتيزم", darija: "طبيب ديال الروماتيزم" },
        { en: "nephrologist", fr: "néphrologue", ar: "طبيب الكلى", darija: "طبيب ديال الكلي" },
        { en: "infectious disease specialist", fr: "infectiologue", ar: "طبيب الأمراض المعدية", darija: "طبيب ديال الميكروبات" },
    ];

    // Faire défiler vers le bas à chaque mise à jour des messages
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mettre en gras les spécialités médicales dans la réponse
    const formatMessage = (content: string): string => {
        let formattedContent = content;

        medicalSpecialists.forEach((specialist) => {
            Object.values(specialist).forEach((translation) => {
                const regex = new RegExp(`\\b${translation}\\b`, "gi");
                formattedContent = formattedContent.replace(regex, `<strong>${translation}</strong>`);
            });
        });

        return formattedContent;
    };

    // Gérer l'envoi d'un message
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: "user", content: input };

        // Ajouter le message utilisateur immédiatement
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Effacer le champ d'entrée immédiatement
        setInput("");

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: [userMessage] }),
            });

            const data = await response.json();
            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: data.content,
            };

            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: "assistant",
                content: "Error fetching response.",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full"
            >
                {isChatOpen ? <X /> : <Bot />}
            </button>

            {isChatOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col">
                    <div className="p-4 bg-blue-500 text-white font-bold">Medical AI Chat</div>
                    <div
                        className="flex-1 p-4 overflow-y-auto"
                        ref={chatContainerRef}
                        style={{ overflowY: "auto" }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.role === "user" ? "text-right" : "text-left"}
                            >
                                <p
                                    className={`inline-block p-2 rounded ${
                                        msg.role === "user"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            msg.role === "assistant"
                                                ? formatMessage(msg.content)
                                                : msg.content,
                                    }}
                                ></p>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 flex">
                        <input
                            className="flex-1 p-2 border rounded"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress} // Gérer l'envoi avec Entrée
                            placeholder="Type your message"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="ml-2 bg-blue-500 text-white p-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicalAIChat;
