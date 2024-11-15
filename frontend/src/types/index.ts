export interface Attribute {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'tags';
    isVisible: boolean;
  }
  
  export interface Image {
    id: number;
    filename: string;
    attributes: Record<string, any>;
    created_at: string;
  }
  
  export interface Gallery {
    id: number;
    name: string;
    description: string;
    attributes: Attribute[];
    created_at: string;
  }