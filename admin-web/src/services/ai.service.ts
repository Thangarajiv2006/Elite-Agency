import axios from "@/helpers/axios";

export interface AIChatMessage {
  role: "user" | "model" | "function";
  parts: any[];
}

export interface AIChatResponse {
  success: boolean;
  answer: string;
  toolsUsed: string[];
  data: any;
  suggestions: string[];
}

export const sendAIChatMessage = async (
  message: string,
  context: { startDate?: string; endDate?: string },
  history: AIChatMessage[],
): Promise<AIChatResponse> => {
  const res = await axios.post("/ai/chat", {
    message,
    context,
    history,
  });
  return res.data;
};
