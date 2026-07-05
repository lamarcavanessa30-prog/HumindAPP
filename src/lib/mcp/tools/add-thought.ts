import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "add_thought",
  title: "Add a thought",
  description:
    "Add a new thought to the Hu-Mind journal. The thought is stored as a short reflective note.",
  inputSchema: {
    text: z.string().trim().min(1).max(4000).describe("The thought to save."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: ({ text }) => {
    return {
      content: [
        { type: "text", text: `Pensiero salvato: "${text}"` },
      ],
      structuredContent: { saved: true, text },
    };
  },
});
