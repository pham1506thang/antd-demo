import type { Media, MediaSize, MediaTag } from '@/models/media';

// Mock data generator
const generateMockImages = (count: number): Media[] => {
  const categories = ['general', 'profile'] as const;
  const fileTypes = ['image'] as const;
  const mimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
  
  return Array.from({ length: count }, (_, index) => {
    const id = `media_${index + 1}`;
    const category = categories[index % categories.length];
    const mimeType = mimeTypes[index % mimeTypes.length];
    const width = 300 + (index % 5) * 100; // 300-700px
    const height = 200 + (index % 4) * 100; // 200-500px
    
    return {
      id,
      originalName: `image_${index + 1}.${mimeType.split('/')[1]}`,
      fileName: `${id}.${mimeType.split('/')[1]}`,
      mimeType,
      fileType: 'image' as const,
      category,
      size: 500000 + (index % 10) * 100000, // 500KB - 1.5MB
      width,
      height,
      uploaderId: 'user_1',
      createdAt: new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - (index % 7) * 24 * 60 * 60 * 1000),
      isActive: true,
      metadata: {
        tags: [`tag_${index % 5}`, `category_${category}`],
        description: `Mock image ${index + 1}`,
      },
      url: `https://picsum.photos/${width}/${height}?random=${index + 1}`,
      thumbnailUrl: `https://picsum.photos/300/200?random=${index + 1}`,
    };
  });
};

// Mock API functions
export const mediaApi = {
  getImages: async (params: {
    category?: 'general' | 'profile';
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ data: Media[]; total: number; page: number; limit: number }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let images = generateMockImages(50);
    
    // Filter by category
    if (params.category) {
      images = images.filter(img => img.category === params.category);
    }
    
    // Filter by search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      images = images.filter(img => 
        img.originalName.toLowerCase().includes(searchLower) ||
        img.metadata.description?.toLowerCase().includes(searchLower) ||
        img.metadata.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: images.slice(startIndex, endIndex),
      total: images.length,
      page,
      limit,
    };
  },
  
  uploadImage: async (file: File): Promise<Media> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const id = `media_${Date.now()}`;
    const category = 'general'; // Default category
    
    return {
      id,
      originalName: file.name,
      fileName: `${id}.${file.name.split('.').pop()}`,
      mimeType: file.type,
      fileType: 'image' as const,
      category,
      size: file.size,
      width: 800,
      height: 600,
      uploaderId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      metadata: {
        tags: ['uploaded'],
        description: `Uploaded image: ${file.name}`,
      },
      url: URL.createObjectURL(file),
      thumbnailUrl: URL.createObjectURL(file),
    };
  },
  
  getImageSizes: async (mediaId: string): Promise<MediaSize[]> => {
    // Mock sizes for an image
    return [
      {
        id: `${mediaId}_thumbnail`,
        mediaId,
        sizeName: 'thumbnail',
        fileName: `${mediaId}_thumbnail.jpg`,
        filePath: `/storage/medias/images/2024/01/${mediaId}/thumbnail.jpg`,
        width: 150,
        height: 150,
        size: 15000,
        quality: 80,
        createdAt: new Date(),
      },
      {
        id: `${mediaId}_small`,
        mediaId,
        sizeName: 'small',
        fileName: `${mediaId}_small.jpg`,
        filePath: `/storage/medias/images/2024/01/${mediaId}/small.jpg`,
        width: 300,
        height: 300,
        size: 30000,
        quality: 85,
        createdAt: new Date(),
      },
      {
        id: `${mediaId}_medium`,
        mediaId,
        sizeName: 'medium',
        fileName: `${mediaId}_medium.jpg`,
        filePath: `/storage/medias/images/2024/01/${mediaId}/medium.jpg`,
        width: 600,
        height: 600,
        size: 60000,
        quality: 90,
        createdAt: new Date(),
      },
      {
        id: `${mediaId}_large`,
        mediaId,
        sizeName: 'large',
        fileName: `${mediaId}_large.jpg`,
        filePath: `/storage/medias/images/2024/01/${mediaId}/large.jpg`,
        width: 1200,
        height: 1200,
        size: 120000,
        quality: 95,
        createdAt: new Date(),
      },
    ];
  },
};