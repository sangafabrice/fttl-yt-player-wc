/**
 * Returns the plural suffix ("s") for English words based on the value.
 * @param {number} durationPart A numeric duration part (e.g., 1, 2, 3).
 * @returns {string} An empty string if the value is singular, otherwise "s".
 * @private
 */
function getPluralSuffix(durationPart) {
    return { one: "", other: "s" }[new Intl.PluralRules("en").select(durationPart)];
}

/**
 * Breaks down a duration in seconds into hours, minutes, and seconds.
 * @param {number} durationInSeconds The duration in seconds.
 * @returns {(number|undefined)[]} An array [hours?, minutes, seconds].
 * @private
 */
function getDurationParts(durationInSeconds) {
    const duration = new Date(durationInSeconds * 1000);
    const durationParts = [, duration.getUTCMinutes(), duration.getUTCSeconds()];
    durationInSeconds >= 3600 && (durationParts[0] = duration.getUTCHours());
    return durationParts;
}

/**
 * Removes leading zero or empty duration parts from the array.
 * @param {(number|undefined)[]} durationParts The array of duration parts.
 * @private
 */
function removeEmptyZeroDurationParts(durationParts) {
    durationParts.forEach((part, index) => part || delete durationParts[index]);
}

/**
 * Converts numeric duration parts into formatted strings with units and pluralization.
 * @param {(number|undefined)[]} durationParts The array of duration parts.
 * @param {string[]} units The units corresponding to each duration part (e.g., ["H", "M", "S"]).
 * @param {function(number): string} [pluralRuleCb] Optional callback for pluralization.
 * @private
 */
function addUnitsToDurationParts(durationParts, units, pluralRuleCb) {
    durationParts.forEach((part, index) => part && (durationParts[index] = `${part}${units[index]}${pluralRuleCb?.(part) ?? ""}`));
}

/**
 * Returns processed duration parts as strings with optional units and pluralization.
 * This function forwards its arguments to `addUnitsToDurationParts`.
 * @see addUnitsToDurationParts
 * @param {number} durationInSeconds The duration in seconds.
 * @returns {string[]} The processed duration parts.
 * @private
 */
function getProcessedDurationParts(durationInSeconds) {
    const durationParts = getDurationParts(durationInSeconds);
    removeEmptyZeroDurationParts(durationParts);
    addUnitsToDurationParts(durationParts, ...[...arguments].slice(1));
    return durationParts;
}

/**
 * Formats duration into machine-readable ISO 8601 string (e.g., "PT1H2M3S").
 * @param {number} durationInSeconds The duration in seconds.
 * @returns {string} The ISO 8601 formatted duration string.
 * @private
 */
function getMachineFormattedDuration(durationInSeconds) {
    return "PT" + getProcessedDurationParts(durationInSeconds, ["H", "M", "S"]).flat().join("");
}

/**
 * Formats duration into a human-readable string for screen readers (e.g., "1 hour 2 minutes 3 seconds").
 * @param {number} durationInSeconds The duration in seconds.
 * @returns {string} The screen-reader friendly duration string.
 * @private
 */
function getSROnlyFormattedDuration(durationInSeconds) {
    return getProcessedDurationParts(durationInSeconds, ["hour", "minute", "second"], getPluralSuffix).flat().join(" ");
}

/**
 * Formats duration into a digital clock-like format (e.g., "1:02:03").
 * @param {number} durationInSeconds The duration in seconds.
 * @returns {string} The digital formatted duration string.
 * @private
 */
function getDigitalFormattedDuration(durationInSeconds) {
    return getDurationParts(durationInSeconds).flat().join(":").replace(/:(\d)\b/g, ":0$1");
}

/**
 * Formats duration into one of three formats:
 * - `"sr-only"` → screen reader friendly string (e.g., "1 hour 2 minutes 3 seconds")
 * - `"machine"` → ISO 8601 duration string (e.g., "PT1H2M3S")
 * - (default)  → digital format (e.g., "1:02:03")
 * @remarks
 * Durations longer than 24 hours are not handled correctly, since the calculation
 * relies on the JavaScript `Date` object (which wraps around after 24h).
 * @param {number} durationInSeconds The duration in seconds.
 * @param {"sr-only"|"machine"|"digital"} [target] The target output format.
 * @returns {string} The formatted duration string.
 */
export function getFormattedDuration(durationInSeconds, target) {
    switch (target) {
        case "sr-only": return getSROnlyFormattedDuration(durationInSeconds);
        case "machine": return getMachineFormattedDuration(durationInSeconds);
        default: return getDigitalFormattedDuration(durationInSeconds);
    }
}