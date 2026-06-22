// =====================================================================
//  Offline outbox — durable, write-through queue for field data entry.
//  next-pwa/Workbox caches READS; this handles WRITES when offline.
//
//  Flow:
//   1. enqueue() stores the mutation in IndexedDB (survives reload/close).
//   2. If online, we flush immediately. If offline, we register a
//      Background Sync tag so the browser flushes when connectivity returns
//      — even if the tab was closed (where supported).
//   3. flush() replays queued items against Supabase and removes successes.
//
//  Keep payloads small and idempotent (use client-generated UUIDs) so a
//  replay never double-inserts — a real risk on flaky rural connections.
// =====================================================================
import { createClient } from "@/lib/supabase/client";

const DB_NAME = "amal-outbox";
const STORE = "queue";
const SYNC_TAG = "amal-flush-outbox";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

/** Queue a write. op = { table, action: 'insert'|'update', row, match } */
export async function enqueue(op) {
  const db = await openDB();
  const item = { id: op.row?.id || crypto.randomUUID(), ts: Date.now(), op };
  await new Promise((res, rej) => {
    const r = tx(db, "readwrite").put(item);
    r.onsuccess = res; r.onerror = () => rej(r.error);
  });

  if (navigator.onLine) {
    flush();
  } else if ("serviceWorker" in navigator && "SyncManager" in window) {
    const reg = await navigator.serviceWorker.ready;
    try { await reg.sync.register(SYNC_TAG); } catch { /* fallback below */ }
  }
  return item.id;
}

async function getAll() {
  const db = await openDB();
  return new Promise((res, rej) => {
    const r = tx(db, "readonly").getAll();
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}

async function remove(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const r = tx(db, "readwrite").delete(id);
    r.onsuccess = res; r.onerror = () => rej(r.error);
  });
}

/** Replay every queued write. Safe to call repeatedly. */
export async function flush() {
  if (!navigator.onLine) return;
  const supabase = createClient();
  const items = await getAll();
  for (const { id, op } of items) {
    try {
      let q;
      if (op.action === "insert") {
        q = supabase.from(op.table).upsert(op.row, { onConflict: "id" });
      } else {
        q = supabase.from(op.table).update(op.row).match(op.match);
      }
      const { error } = await q;
      if (!error) await remove(id);   // only drop on confirmed success
    } catch {
      break;                          // still offline — stop, retry later
    }
  }
}

/** Call once on app start (e.g. in a root client effect). */
export function initOutbox() {
  if (typeof window === "undefined") return;
  window.addEventListener("online", flush);
  flush(); // attempt on load in case items were queued in a previous session
}
