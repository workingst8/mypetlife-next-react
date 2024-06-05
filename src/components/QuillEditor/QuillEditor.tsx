'use client'

import dynamic from "next/dynamic";
import React from 'react';
// import ReactQuill from 'react-quill';
const ReactQuill  = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={(value) => onChange(value)}
        modules={modules}
      />
    </div>
  );
};

export default QuillEditor;
