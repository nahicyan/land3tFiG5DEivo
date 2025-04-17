import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RichTextEditor.css";
// Import react-quill-emoji and its CSS
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";

// Register the emoji modules with Quill globally.
// The second argument "true" indicates a global registration.
Quill.register(
  {
    "formats/emoji": quillEmoji.EmojiBlot,
    "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
    "modules/emoji-shortname": quillEmoji.ShortNameEmoji,
  },
  true
);

const RichTextEditor = ({ value, onChange, placeholder = "Enter text here..." }) => {
  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        ["emoji"], // Add emoji button to toolbar
      ],
    },
    "emoji-toolbar": true,
    "emoji-shortname": true,
    // Removed "emoji-textarea": true to prevent double emoji picker
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "emoji",
  ];

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;