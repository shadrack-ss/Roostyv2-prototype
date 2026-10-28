"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

/**
 * A small TipTap editor that posts its HTML through a hidden input, so it
 * drops into any server-action form. The server sanitises what arrives
 * (lib/sanitize.ts); the toolbar only offers what that allowlist keeps.
 */
export function RichTextEditor({ name, defaultValue, id }: { name: string; defaultValue?: string; id?: string }) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [3] }, code: false, codeBlock: false, horizontalRule: false })],
    content: defaultValue ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        id: id ?? name,
        class: "rte-content min-h-[140px] rounded-b-lg border border-t-0 border-line bg-white px-3 py-2 text-sm focus:outline-none",
      },
    },
  });

  if (!editor) {
    return <textarea name={name} defaultValue={defaultValue} rows={6} className="w-full rounded-lg border border-line px-3 py-2 text-sm" />;
  }

  const tools = [
    { label: "Bold", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "Italic", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "Heading", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading") },
    { label: "Bullets", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "Numbers", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-line bg-canvas px-2 py-1">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={tool.run}
            className={`rounded px-2 py-1 text-xs font-medium ${tool.active ? "bg-brand text-white" : "text-ink hover:bg-black/5"}`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
