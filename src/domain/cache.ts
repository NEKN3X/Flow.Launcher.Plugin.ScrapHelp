export type WriteCache = <T>(key: string, value: T) => void;
export type ReadCache = <T>(key: string) => T | undefined;
