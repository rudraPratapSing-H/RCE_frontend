import React from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

type EditorPanelProps = {
  language: string;
  code: string;
  setCode: (code: string) => void;
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ language, code, setCode }) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (!monaco) return;
    const monacoAny = monaco as any;

    // Disable JS/TS diagnostics to remove red squiggles.
    monacoAny.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });

    monacoAny.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });
  }, [monaco]);

  return (
    <div className="h-full w-full min-h-0">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          inlineSuggest: { enabled: false },
          parameterHints: { enabled: false },
          wordBasedSuggestions: 'off',
          tabCompletion: 'off',
          acceptSuggestionOnEnter: 'off',
          snippetSuggestions: 'none'
        }}
      />
    </div>
  );
};
