import React from 'react';
import { ProjectCard } from '../portfolio/ProjectCard';
import type { PortfolioItem } from '../../types/profile';

interface SlideTrackProps {
  title?: string;
  items: PortfolioItem[];
  onSelectProject: (project: PortfolioItem) => void;
  onInspectItem?: (project: PortfolioItem) => void;
  isInspectable?: boolean;
}

export const SlideTrack: React.FC<SlideTrackProps> = ({
  title,
  items,
  onSelectProject,
  onInspectItem,
  isInspectable = false
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginTop: '5rem', marginBottom: '4rem' }}>
      {title && (
        <div className="slide-track-header">
          <h2 className="slide-track-title">{title}</h2>
        </div>
      )}

      <div className="slide-track-container">
        {items.map((item) => (
          <ProjectCard
            key={item.id}
            project={item}
            variant="slide"
            onClick={() => onSelectProject(item)}
            onInspect={() => onInspectItem && onInspectItem(item)}
            isInspectable={isInspectable}
          />
        ))}
      </div>
    </div>
  );
};
