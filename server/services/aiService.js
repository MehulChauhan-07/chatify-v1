import OpenAI from "openai";

class AIService {
  constructor() {
    this.openai = null;
    this.isConfigured = false;
    
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.isConfigured = true;
    }
  }

  async chat(messages, options = {}) {
    if (!this.isConfigured) {
      throw new Error("OpenAI API key not configured");
    }

    const {
      model = process.env.AI_MODEL || "gpt-4-turbo-preview",
      maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 2000,
      temperature = 0.7,
      stream = false,
    } = options;

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream,
      });

      if (stream) {
        return response;
      }

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error("Error in AI chat:", error);
      throw error;
    }
  }

  async streamChat(messages, options = {}) {
    return this.chat(messages, { ...options, stream: true });
  }

  async summarizeConversation(messages) {
    if (!this.isConfigured) {
      throw new Error("OpenAI API key not configured");
    }

    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const summaryMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes conversations. Provide a concise summary of the key points.",
      },
      {
        role: "user",
        content: `Please summarize this conversation:\n\n${conversationText}`,
      },
    ];

    const response = await this.chat(summaryMessages, { maxTokens: 500 });
    return response.content;
  }

  async answerQuestion(question, context = "") {
    if (!this.isConfigured) {
      throw new Error("OpenAI API key not configured");
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant. Answer questions based on the provided context or your knowledge.",
      },
    ];

    if (context) {
      messages.push({
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}`,
      });
    } else {
      messages.push({
        role: "user",
        content: question,
      });
    }

    const response = await this.chat(messages);
    return response.content;
  }

  async generateGroupSummary(groupMessages) {
    if (!this.isConfigured) {
      throw new Error("OpenAI API key not configured");
    }

    const messagesText = groupMessages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes group chat conversations. Provide a clear, organized summary of the main topics discussed.",
      },
      {
        role: "user",
        content: `Please summarize this group chat:\n\n${messagesText}`,
      },
    ];

    const response = await this.chat(messages, { maxTokens: 800 });
    return response.content;
  }

  isAvailable() {
    return this.isConfigured;
  }
}

export default new AIService();
