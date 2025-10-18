/**
 * Base model interface with common fields
 * All date fields are stored as strings to maintain serializability
 */
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Helper type for models that extend BaseModel
 */
export type WithTimestamps<T> = T & BaseModel;
