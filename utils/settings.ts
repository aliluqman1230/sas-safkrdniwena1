export interface AppSettings {
  hasSeenOnboarding: boolean;
  // Add other settings here in the future, e.g., theme: 'dark' | 'light';
}

const SETTINGS_KEY = 'photoEnhancerAppSettings';

const defaultSettings: AppSettings = {
  hasSeenOnboarding: false,
};

/**
 * Retrieves settings from localStorage.
 * Returns default settings if nothing is found or an error occurs.
 */
export const getSettings = (): AppSettings => {
  try {
    const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      // Merge with defaults to ensure all keys are present if the stored object is outdated
      return { ...defaultSettings, ...parsedSettings };
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }
  return defaultSettings;
};

/**
 * Updates and saves settings to localStorage.
 * Merges the provided partial settings with the existing ones.
 * @param newSettings - An object containing the settings to update.
 */
export const updateSettings = (newSettings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};
