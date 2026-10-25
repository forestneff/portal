import React from 'react';

interface RichTextStageProps {
  title?: string;
  content?: string;
}

export const RichTextStage: React.FC<RichTextStageProps> = ({ title, content }) => {
  if (!content) return null;

  return (
    <div style={{
      maxWidth: '56rem',
      margin: '5rem auto',
      padding: '0 1.5rem',
      fontFamily: 'var(--font-head)'
    }}>
      {title && (
        <h3 style={{
          fontSize: '3.5rem',
          fontStyle: 'italic',
          color: 'var(--text-main)',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--emerald-200)',
          paddingBottom: '1rem'
        }}>
          {title}
        </h3>
      )}
      <div style={{
        fontSize: '1.4rem',
        lineHeight: 1.85,
        color: 'var(--text-muted)',
        fontWeight: 300,
        whiteSpace: 'pre-line'
      }}>
        {content}
      </div>
    </div>
  );
};
