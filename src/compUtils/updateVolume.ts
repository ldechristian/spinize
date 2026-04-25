const STORAGE_KEY = "audio_volume";

// Clamp helper to keep values between 0 and 1
function clamp(value: number) {
    return Math.min(1, Math.max(0, value));
}

// Load from localStorage
function get_linear_volume_from_local_storage(): number {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) return 0.5; // default

    const parsed = parseFloat(stored);

    if (isNaN(parsed)) return 0.5;

    return clamp(parsed);
}

// Save to localStorage
function save_linear_volume_to_local_storage(value: number) {
    localStorage.setItem(STORAGE_KEY, value.toString());
}

// Perceptual normalization
function normalize_volume(linear: number) {
    return Math.pow(linear, 2.5);
    // const linear = newVolume / 100;
    // const minDb = -40; // silence floor
    // const db = minDb * (1 - linear);
    // audio.volume = Math.pow(10, db / 20);
}

// Initialize
let linear_volume = get_linear_volume_from_local_storage();

// Update API
export function updateVolume(new_linear_volume: number) {
    linear_volume = clamp(new_linear_volume);

    save_linear_volume_to_local_storage(linear_volume);
}

// Getters
export function get_linear_volume() {
    return linear_volume;
}

export function get_normal_volume() {
    return normalize_volume(linear_volume);
}