export interface GalleryItem {
  id: string;
  original: string;
  enhanced: string;
  timestamp: number;
}

const GALLERY_KEY = 'photoEnhancerGallery';

export const getGalleryItems = (): GalleryItem[] => {
  try {
    const storedItems = window.localStorage.getItem(GALLERY_KEY);
    if (storedItems) {
      const items = JSON.parse(storedItems) as GalleryItem[];
      // Sort by timestamp, newest first
      return items.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (error) {
    console.error('Error reading gallery from localStorage:', error);
  }
  return [];
};

export const saveToGallery = (item: { original: string; enhanced: string }): void => {
  try {
    const currentItems = getGalleryItems();
    const newItem: GalleryItem = {
      ...item,
      id: `gallery-item-${Date.now()}`,
      timestamp: Date.now(),
    };
    // Prepend new item to the start of the array
    const updatedItems = [newItem, ...currentItems];
    window.localStorage.setItem(GALLERY_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Error saving to gallery in localStorage:', error);
  }
};

export const deleteFromGallery = (id: string): GalleryItem[] => {
  try {
    const currentItems = getGalleryItems();
    const updatedItems = currentItems.filter(item => item.id !== id);
    window.localStorage.setItem(GALLERY_KEY, JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.error('Error deleting from gallery in localStorage:', error);
    return getGalleryItems(); // return original list on error
  }
};
