import { defineMcp } from "@lovable.dev/mcp-js";
import listThoughts from "./tools/list-thoughts";
import addThought from "./tools/add-thought";
import listThemes from "./tools/list-themes";

export default defineMcp({
  name: "humind-mcp",
  title: "Hu-Mind",
  version: "0.1.0",
  instructions:
    "Tools for Hu-Mind, a reflective journaling companion. Use `list_recent_thoughts` to read the user's latest journal entries, `add_thought` to append a new reflection, and `list_emerging_themes` to see recurring qualitative themes.",
  tools: [listThoughts, addThought, listThemes],
});
