export declare const ROOT: string;
export declare const TIERS: string[];
export declare const NAME_OVERRIDES: Record<string, string>;
export declare const EXPLICIT_ENTRIES: Record<string, string>;
export declare function toKebab(name: string): string;
export declare function discoverComponentEntries(): Record<string, string>;
export declare function publicEntries(): Record<string, string>;
