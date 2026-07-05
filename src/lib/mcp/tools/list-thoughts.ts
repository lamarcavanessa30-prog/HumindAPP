import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_recent_thoughts",
  title: "List recent thoughts",
  description:
    "List the user's most recent journal thoughts captured in Hu-Mind, newest first.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of thoughts to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit }) => {
    const sample = [
      { date: "oggi", text: "Mi accorgo che quando vado di fretta perdo i dettagli." },
      { date: "ieri", text: "Ho letto piano. È stata una forma di riposo." },
      { date: "2 giorni fa", text: "Ho detto di sì a qualcosa senza pensarci." },
    ].slice(0, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(sample, null, 2) }],
      structuredContent: { thoughts: sample },
    };
  },
});
