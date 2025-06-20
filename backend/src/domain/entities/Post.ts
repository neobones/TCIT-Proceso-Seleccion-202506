export class Post {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date = new Date()
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this.name?.trim()) {
      throw new Error('El nombre del post es requerido y no puede estar vacío');
    }
    
    if (!this.description?.trim()) {
      throw new Error('La descripción del post es requerida y no puede estar vacía');
    }
    
    if (this.name.length > 100) {
      throw new Error('El nombre del post no puede exceder 100 caracteres');
    }
    
    if (this.description.length > 500) {
      throw new Error('La descripción del post no puede exceder 500 caracteres');
    }
  }

  public update(name: string, description: string): Post {
    return new Post(this.id, name, description, this.createdAt);
  }

  public toPlainObject(): PostData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt
    };
  }

  public static fromPlainObject(data: PostData): Post {
    return new Post(data.id, data.name, data.description, data.createdAt);
  }
}

export interface PostData {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface CreatePostRequest {
  name: string;
  description: string;
}

export interface PostResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
} 