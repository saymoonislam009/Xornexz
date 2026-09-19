"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { useState } from "react";
import MediaPicker from "./MediaPicker";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = "Write your article content here...",
}: TiptapEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-violet-400 underline hover:text-violet-300",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-white/10",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[320px] p-4 focus:outline-none text-white/90 text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="w-full h-80 bg-[#0E1018] border border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageModal(false);
  };

  return (
    <div className="w-full bg-[#0E1018] border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-white/5 border-b border-white/10 text-gray-400">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("bold") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("italic") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("underline") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("strike") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("heading", { level: 1 }) ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("heading", { level: 2 }) ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("heading", { level: 3 }) ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("bulletList") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("orderedList") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("blockquote") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("codeBlock") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Code Block"
        >
          <Code size={16} />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:text-white hover:bg-white/10 transition ${
            editor.isActive("link") ? "text-violet-400 bg-violet-600/20" : ""
          }`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded hover:text-white hover:bg-white/10 transition"
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:text-white hover:bg-white/10 transition disabled:opacity-30"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:text-white hover:bg-white/10 transition disabled:opacity-30"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Image Modal for Direct R2 Upload */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0D14] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-semibold text-white">Insert Image into Article</h3>
            <p className="text-xs text-gray-400">
              Upload an image directly to Cloudflare R2 CDN. It will automatically convert to WebP.
            </p>
            <MediaPicker
              onChange={handleInsertImage}
              onRemove={() => setShowImageModal(false)}
              label="Select or Drag Image"
            />
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
