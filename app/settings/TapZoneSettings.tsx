"use client";
import { FC, useCallback } from "react";
import {
    TapAction,
    TapZoneGrid,
    TAP_PRESET_RIGHT_HAND,
    TAP_PRESET_LEFT_HAND,
    TAP_PRESET_DEFAULT,
    useUserSettings
} from "./useUserSettings";
import styles from "./TapZoneSettings.module.css";

// アクションの表示名と色
const ACTION_CONFIG: Record<TapAction, { label: string; color: string; shortLabel: string }> = {
    next: { label: "Next", color: "#4caf50", shortLabel: "Next" },
    prev: { label: "Prev", color: "#2196f3", shortLabel: "Prev" },
    menu: { label: "Menu", color: "#ff9800", shortLabel: "Menu" },
    close: { label: "Close", color: "#f44336", shortLabel: "Close" },
    none: { label: "None", color: "#9e9e9e", shortLabel: "-" }
};

// アクションの順序（タップで切り替え）
const ACTION_ORDER: TapAction[] = ["next", "prev", "menu", "close", "none"];

type TapZoneSettingsProps = {
    className?: string;
};

export const TapZoneSettings: FC<TapZoneSettingsProps> = ({ className }) => {
    const { userSettings, updateUserSettings } = useUserSettings();
    const zones = userSettings?.tapZones?.zones ?? TAP_PRESET_RIGHT_HAND;

    const updateZone = useCallback(
        (row: number, col: number) => {
            const currentAction = zones[row][col];
            const currentIndex = ACTION_ORDER.indexOf(currentAction);
            const nextAction = ACTION_ORDER[(currentIndex + 1) % ACTION_ORDER.length];

            // 新しいzonesを作成
            const newZones: TapZoneGrid = zones.map((r, ri) =>
                r.map((c, ci) => (ri === row && ci === col ? nextAction : c))
            ) as TapZoneGrid;

            updateUserSettings({
                openNewTab: userSettings?.openNewTab ?? true,
                uploadBookToNotion: userSettings?.uploadBookToNotion ?? false,
                tapZones: { zones: newZones }
            });
        },
        [zones, userSettings, updateUserSettings]
    );

    const applyPreset = useCallback(
        (preset: TapZoneGrid) => {
            updateUserSettings({
                openNewTab: userSettings?.openNewTab ?? true,
                uploadBookToNotion: userSettings?.uploadBookToNotion ?? false,
                tapZones: { zones: preset }
            });
        },
        [userSettings, updateUserSettings]
    );

    return (
        <section className={className} aria-labelledby="tap-zone-settings-heading">
            <h3 id="tap-zone-settings-heading">Tap Zones</h3>
            <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "12px" }}>Tap each area to change its action</p>

            {/* Preset buttons */}
            <div className={styles.presets} role="group" aria-label="Presets">
                <button type="button" className={styles.presetButton} onClick={() => applyPreset(TAP_PRESET_DEFAULT)}>
                    Default
                </button>
                <button
                    type="button"
                    className={styles.presetButton}
                    onClick={() => applyPreset(TAP_PRESET_RIGHT_HAND)}
                >
                    Right Hand
                </button>
                <button type="button" className={styles.presetButton} onClick={() => applyPreset(TAP_PRESET_LEFT_HAND)}>
                    Left Hand
                </button>
            </div>

            {/* 3x3 Grid */}
            <div className={styles.grid} role="grid" aria-label="Tap zone settings">
                {zones.map((row, rowIndex) =>
                    row.map((action, colIndex) => {
                        const config = ACTION_CONFIG[action];
                        return (
                            <button
                                key={`${rowIndex}-${colIndex}`}
                                type="button"
                                className={styles.cell}
                                style={{ backgroundColor: config.color }}
                                onClick={() => updateZone(rowIndex, colIndex)}
                                aria-label={`${config.label} - Row ${rowIndex + 1} Column ${colIndex + 1}`}
                                data-testid={`tap-zone-${rowIndex}-${colIndex}`}
                            >
                                <span className={styles.cellLabel}>{config.shortLabel}</span>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Legend */}
            <div className={styles.legend} aria-label="Legend">
                {ACTION_ORDER.map((action) => {
                    const config = ACTION_CONFIG[action];
                    return (
                        <div key={action} className={styles.legendItem}>
                            <span
                                className={styles.legendColor}
                                style={{ backgroundColor: config.color }}
                                aria-hidden="true"
                            />
                            <span>{config.label}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
