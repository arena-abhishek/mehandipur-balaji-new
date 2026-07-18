"use client";

import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// Make sure to import the editor build correctly
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Import the CKEditor CSS
import '../../../styles/style.css';

const PrivacyPolicyEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title,
      content,
    });
    // Add your API call here to save the data
  };

  const editorConfiguration = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Policy Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter privacy policy title"
              />
            </div>

            {/* Editor Input */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Policy Content</label>
              <div className="border rounded-md dark:border-gray-700">
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                  onReady={(editor) => {
                    // Set minimum height for the editing area
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        'min-height',
                        '500px',
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                />
              </div>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Privacy Policy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyEditor;
