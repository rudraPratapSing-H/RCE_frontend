import React from 'react';
import Editor from '@monaco-editor/react';

type EditorPanelProps = {
  language: string;
  code: string;
  setCode: (code: string) => void;
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ language, code, setCode }) => {
  return (
    <div className="h-2/3 min-h-0">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false
        }}
      />
    </div>
  );
};
