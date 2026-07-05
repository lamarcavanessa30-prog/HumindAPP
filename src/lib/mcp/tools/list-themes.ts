import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_emerging_themes",
  title: "List emerging themes",
  description:
    "List the recurring qualitative themes emerging from the user's recent reflections in Hu-Mind.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const themes = [
      "Architettura interiore",
      "Letture lente",
      "Rituali che restituiscono energia",
    ];
    return {
      content: [{ type: "text", text: themes.join("\n") }],
      structuredContent: { themes },
    };
  },
});
