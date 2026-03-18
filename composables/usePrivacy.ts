const PRIVACY_STORAGE_KEY = "privacy-settings";

interface IPrivacySettings {
  enabled: boolean;
  blurAmount: number;
}

const defaultSettings = (): IPrivacySettings => ({
  enabled: false,
  blurAmount: 8,
});

const clampBlurAmount = (value: number) => Math.min(Math.max(Math.round(value), 2), 20);

export default function usePrivacy() {
  const settings = useState<IPrivacySettings>("privacy-settings", defaultSettings);
  const isReady = useState<boolean>("privacy-settings-ready", () => false);

  const loadSettings = () => {
    if (!import.meta.client || isReady.value) return;

    const rawSettings = localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (!rawSettings) {
      isReady.value = true;
      return;
    }

    try {
      const parsed = JSON.parse(rawSettings) as Partial<IPrivacySettings>;
      settings.value = {
        enabled: Boolean(parsed.enabled),
        blurAmount: clampBlurAmount(Number(parsed.blurAmount ?? defaultSettings().blurAmount)),
      };
    } catch (error) {
      console.error("Failed to parse privacy settings:", error);
      settings.value = defaultSettings();
    } finally {
      isReady.value = true;
    }
  };

  if (import.meta.client && !isReady.value) {
    loadSettings();
  }

  watch(
    settings,
    (value) => {
      if (!import.meta.client || !isReady.value) return;
      localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true }
  );

  const setPrivacyEnabled = (enabled: boolean) => {
    settings.value.enabled = enabled;
  };

  const setBlurAmount = (value: number) => {
    settings.value.blurAmount = clampBlurAmount(value);
  };

  const blurStyle = computed(() =>
    settings.value.enabled
      ? {
          filter: `blur(${settings.value.blurAmount}px)`,
          transition: "filter 160ms ease",
        }
      : undefined
  );

  const blurLabel = computed(() => `${settings.value.blurAmount}px`);

  return {
    settings,
    blurStyle,
    blurLabel,
    setPrivacyEnabled,
    setBlurAmount,
    loadSettings,
  };
}
