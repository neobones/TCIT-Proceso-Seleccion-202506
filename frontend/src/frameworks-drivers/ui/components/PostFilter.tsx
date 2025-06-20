import React from 'react';

interface PostFilterProps {
  value: string;
  onChange: (term: string) => void;
  disabled?: boolean;
}

export const PostFilter: React.FC<PostFilterProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="post-filter">
      <div className="filter-group">
        <label htmlFor="filter">Filtrar por nombre:</label>
        <div className="filter-input-container">
          <input
            id="filter"
            type="text"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            maxLength={50}
            placeholder="Buscar posts por nombre..."
            className="filter-input"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="clear-button"
              title="Limpiar filtro"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 