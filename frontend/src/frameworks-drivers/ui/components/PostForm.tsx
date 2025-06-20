import React, { useState } from 'react';
import { CreatePostRequest } from '@domain/entities/Post';
import { PostValidation } from '@domain/value-objects/PostValidation';

interface PostFormProps {
  onSubmit: (data: CreatePostRequest) => void;
  loading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    const validation = PostValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
    
    // Limpiar formulario después del envío
    setFormData({ name: '', description: '' });
  };

  const handleChange = (field: keyof CreatePostRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="post-form">
      <h2>Crear Nuevo Post</h2>
      
      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            disabled={loading}
            maxLength={100}
            placeholder="Ingresa el nombre del post"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange('description')}
            disabled={loading}
            maxLength={500}
            rows={4}
            placeholder="Ingresa la descripción del post"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.name.trim() || !formData.description.trim()}
          className="submit-button"
        >
          {loading ? 'Creando...' : 'Crear Post'}
        </button>
      </form>
    </div>
  );
}; 