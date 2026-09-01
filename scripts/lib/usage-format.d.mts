export interface UsageLine {
  text: string;
  line: number;
}
export interface UsageExample {
  lang: string;
  line: number;
  code: string;
}
export interface UsageDoc {
  title: string;
  subpath: string;
  group: string;
  docs: string;
  summary: string;
  prose: UsageLine[];
  examples: UsageExample[];
}
export interface UsageGroup {
  id: string;
  title: string;
  note: string;
}
export interface UsageModule {
  subpath: string;
  typesPath: string;
  sourcePath?: string;
  usagePath: string | null;
  usage?: UsageDoc;
  usageErrors?: string[];
}
export declare const HEADING_RE: RegExp;
export declare const GROUPS: UsageGroup[];
export declare const GROUP_IDS: Set<string>;
export declare function parseUsage(text: string): { doc: UsageDoc; errors: string[] };
export declare function usagePathFor(source: string | undefined): string | null;
export declare function loadModules(root: string): { version: string; modules: UsageModule[] };
export declare function buildIndex(modules: UsageModule[]): string;
