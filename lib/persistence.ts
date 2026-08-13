import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Asynchronous non-blocking persistent JSON reader (backup/local cache store).
 */
export function readPersistentJSON<T>(filename: string, fallback: T): T {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Error reading persistent JSON ${filename}:`, e);
    return fallback;
  }
}

/**
 * Asynchronous non-blocking persistent JSON writer (secondary backup store).
 */
export function writePersistentJSON<T>(filename: string, data: T): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8", (err) => {
      if (err) console.error(`Asynchronous persistent disk write error for ${filename}:`, err);
    });
  } catch (e) {
    console.error(`Error initiating persistent JSON write for ${filename}:`, e);
  }
}

/**
 * Database-First Loader: Tries primary Supabase PostgreSQL table query first,
 * falling back to local persistent store if DB is unreachable.
 */
export async function loadDatabaseFirst<T>(
  dbFetcher: () => Promise<T | null>,
  filename: string,
  fallback: T
): Promise<T> {
  try {
    const dbResult = await dbFetcher();
    if (dbResult !== null) {
      // Async write to local disk backup
      writePersistentJSON(filename, dbResult);
      return dbResult;
    }
  } catch (e) {
    console.warn(`Database query failed for ${filename}, falling back to local persistent store:`, e);
  }

  return readPersistentJSON<T>(filename, fallback);
}
