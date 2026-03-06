/**
 * Appwrite compatibility layer — same API as Supabase client
 * Drop-in replacement: all existing .from().select().eq() calls work unchanged
 */
import { Client, Account, Databases, Storage, Query, ID, type Models } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.vibecoding.by/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '69aa2114000211b48e63';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'vibecoding';
const API_URL = import.meta.env.VITE_API_URL || 'https://vibecoding.by/functions/v1';

// Appwrite client
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const appwriteClient = client;

// ─── Types ───
interface QueryResult<T = any> {
  data: T | null;
  error: { message: string; code?: number } | null;
  count?: number;
}

// ─── Query Builder (mimics supabase.from().select().eq()...) ───
class QueryBuilder {
  private collection: string;
  private _select: string = '*';
  private _filters: string[] = [];
  private _order: { field: string; ascending: boolean }[] = [];
  private _limit: number | null = null;
  private _single = false;
  private _maybeSingle = false;
  private _count: 'exact' | null = null;

  constructor(collection: string) {
    this.collection = collection;
  }

  select(fields: string = '*', opts?: { count?: 'exact' }): this {
    this._select = fields;
    if (opts?.count) this._count = opts.count;
    return this;
  }

  eq(field: string, value: any): this {
    this._filters.push(`eq:${field}:${JSON.stringify(value)}`);
    return this;
  }

  neq(field: string, value: any): this {
    this._filters.push(`neq:${field}:${JSON.stringify(value)}`);
    return this;
  }

  in(field: string, values: any[]): this {
    this._filters.push(`in:${field}:${JSON.stringify(values)}`);
    return this;
  }

  gt(field: string, value: any): this {
    this._filters.push(`gt:${field}:${JSON.stringify(value)}`);
    return this;
  }

  gte(field: string, value: any): this {
    this._filters.push(`gte:${field}:${JSON.stringify(value)}`);
    return this;
  }

  lt(field: string, value: any): this {
    this._filters.push(`lt:${field}:${JSON.stringify(value)}`);
    return this;
  }

  lte(field: string, value: any): this {
    this._filters.push(`lte:${field}:${JSON.stringify(value)}`);
    return this;
  }

  ilike(field: string, pattern: string): this {
    const searchTerm = pattern.replace(/%/g, '');
    this._filters.push(`search:${field}:${JSON.stringify(searchTerm)}`);
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }): this {
    this._order.push({ field, ascending: opts?.ascending ?? true });
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  single(): this {
    this._single = true;
    this._limit = 1;
    return this;
  }

  maybeSingle(): this {
    this._maybeSingle = true;
    this._limit = 1;
    return this;
  }

  // Build Appwrite queries array
  private buildQueries(): string[] {
    const queries: string[] = [];

    for (const f of this._filters) {
      const [op, field, rawVal] = f.split(':').length === 3
        ? [f.split(':')[0], f.split(':')[1], f.split(':').slice(2).join(':')]
        : ['', '', ''];
      const val = JSON.parse(rawVal);

      switch (op) {
        case 'eq':
          queries.push(Query.equal(field, val));
          break;
        case 'neq':
          queries.push(Query.notEqual(field, val));
          break;
        case 'in':
          queries.push(Query.equal(field, val));
          break;
        case 'gt':
          queries.push(Query.greaterThan(field, val));
          break;
        case 'gte':
          queries.push(Query.greaterThanEqual(field, val));
          break;
        case 'lt':
          queries.push(Query.lessThan(field, val));
          break;
        case 'lte':
          queries.push(Query.lessThanEqual(field, val));
          break;
        case 'search':
          queries.push(Query.search(field, val));
          break;
      }
    }

    for (const o of this._order) {
      queries.push(o.ascending ? Query.orderAsc(o.field) : Query.orderDesc(o.field));
    }

    if (this._limit) {
      queries.push(Query.limit(this._limit));
    } else {
      queries.push(Query.limit(100)); // default
    }

    return queries;
  }

  // Convert Appwrite document to plain object (strip $id, $collectionId etc)
  private docToRow(doc: Models.Document): any {
    const row: any = { id: doc.$id };
    for (const [k, v] of Object.entries(doc)) {
      if (k.startsWith('$')) continue;
      row[k] = v;
    }
    return row;
  }

  // Execute SELECT
  async then(resolve: (val: QueryResult) => void, reject?: (err: any) => void) {
    try {
      const queries = this.buildQueries();
      const result = await databases.listDocuments(DATABASE_ID, this.collection, queries);
      const rows = result.documents.map(d => this.docToRow(d));

      if (this._single) {
        if (rows.length === 0) {
          resolve({ data: null, error: { message: 'Not found', code: 404 } });
        } else {
          resolve({ data: rows[0], error: null });
        }
      } else if (this._maybeSingle) {
        resolve({ data: rows[0] || null, error: null });
      } else {
        const res: QueryResult = { data: rows, error: null };
        if (this._count === 'exact') res.count = result.total;
        resolve(res);
      }
    } catch (e: any) {
      if (this._maybeSingle) {
        resolve({ data: null, error: null });
      } else {
        resolve({ data: null, error: { message: e.message, code: e.code } });
      }
    }
  }

  // INSERT
  async insert(docs: any | any[]): Promise<QueryResult> {
    try {
      const arr = Array.isArray(docs) ? docs : [docs];
      const created = [];
      for (const doc of arr) {
        const { id, ...data } = doc;
        const docId = id ? String(id).replace(/-/g, '').substring(0, 36) : ID.unique();
        // Clean undefined values
        const clean: any = {};
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) clean[k] = v;
        }
        const result = await databases.createDocument(DATABASE_ID, this.collection, docId, clean);
        created.push(this.docToRow(result));
      }
      return { data: created.length === 1 ? created[0] : created, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message, code: e.code } };
    }
  }

  // UPDATE — needs .eq() before calling
  async update(updates: any): Promise<QueryResult> {
    try {
      // Find documents matching filters
      const queries = this.buildQueries();
      const result = await databases.listDocuments(DATABASE_ID, this.collection, queries);

      if (result.documents.length === 0) {
        return { data: null, error: null };
      }

      const updated = [];
      for (const doc of result.documents) {
        const clean: any = {};
        for (const [k, v] of Object.entries(updates)) {
          if (v !== undefined && !k.startsWith('$') && k !== 'id') clean[k] = v;
        }
        const res = await databases.updateDocument(DATABASE_ID, this.collection, doc.$id, clean);
        updated.push(this.docToRow(res));
      }
      return { data: updated.length === 1 ? updated[0] : updated, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message, code: e.code } };
    }
  }

  // UPSERT
  async upsert(doc: any, opts?: { onConflict?: string }): Promise<QueryResult> {
    try {
      const conflictField = opts?.onConflict || 'id';
      const conflictValue = doc[conflictField];

      if (conflictValue) {
        // Try to find existing
        const existing = await databases.listDocuments(DATABASE_ID, this.collection, [
          Query.equal(conflictField, conflictValue),
          Query.limit(1),
        ]);

        if (existing.documents.length > 0) {
          const clean: any = {};
          for (const [k, v] of Object.entries(doc)) {
            if (v !== undefined && !k.startsWith('$') && k !== 'id') clean[k] = v;
          }
          const res = await databases.updateDocument(DATABASE_ID, this.collection, existing.documents[0].$id, clean);
          return { data: this.docToRow(res), error: null };
        }
      }

      // Create new
      return this.insert(doc);
    } catch (e: any) {
      return { data: null, error: { message: e.message, code: e.code } };
    }
  }

  // DELETE
  async delete(): Promise<QueryResult> {
    try {
      const queries = this.buildQueries();
      const result = await databases.listDocuments(DATABASE_ID, this.collection, queries);

      for (const doc of result.documents) {
        await databases.deleteDocument(DATABASE_ID, this.collection, doc.$id);
      }
      return { data: null, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message, code: e.code } };
    }
  }
}

// ─── Storage Builder (mimics supabase.storage.from()) ───
class StorageBucketBuilder {
  private bucket: string;

  constructor(bucket: string) {
    this.bucket = bucket;
  }

  async upload(path: string, file: File | Blob | Buffer, opts?: { contentType?: string; upsert?: boolean }): Promise<{ data: { path: string } | null; error: any }> {
    try {
      const fileId = path.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 36) || ID.unique();
      const uploadFile = file instanceof File ? file : new File([file], path);
      const result = await storage.createFile(this.bucket, fileId, uploadFile);
      return { data: { path: result.$id }, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  }

  getPublicUrl(path: string): { data: { publicUrl: string } } {
    const url = `${ENDPOINT}/storage/buckets/${this.bucket}/files/${path}/view?project=${PROJECT_ID}`;
    return { data: { publicUrl: url } };
  }

  async download(path: string): Promise<{ data: Blob | null; error: any }> {
    try {
      const result = await storage.getFileDownload(this.bucket, path);
      return { data: result as unknown as Blob, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  }

  async remove(paths: string[]): Promise<{ error: any }> {
    try {
      for (const p of paths) {
        await storage.deleteFile(this.bucket, p);
      }
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message } };
    }
  }
}

// ─── Auth (mimics supabase.auth) ───
type AuthChangeCallback = (event: string, session: any) => void;
let authListeners: AuthChangeCallback[] = [];

const auth = {
  async getSession() {
    try {
      const user = await account.get();
      const session = { user: { id: user.$id, email: user.email, user_metadata: { full_name: user.name } } };
      return { data: { session }, error: null };
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  async getUser() {
    try {
      const user = await account.get();
      return { data: { user: { id: user.$id, email: user.email, user_metadata: { full_name: user.name } } }, error: null };
    } catch {
      return { data: { user: null }, error: null };
    }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      const session = { user: { id: user.$id, email: user.email, user_metadata: { full_name: user.name } } };
      authListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { user: session.user, session }, error: null };
    } catch (e: any) {
      return { data: { user: null, session: null }, error: { message: e.message } };
    }
  },

  async signUp({ email, password, options }: { email: string; password: string; options?: any }) {
    try {
      const fullName = options?.data?.full_name || '';
      await account.create(ID.unique(), email, password, fullName);
      // Auto sign in after signup
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      const session = { user: { id: user.$id, email: user.email, user_metadata: { full_name: fullName } } };
      authListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { user: session.user, session }, error: null };
    } catch (e: any) {
      return { data: { user: null, session: null }, error: { message: e.message } };
    }
  },

  async signInWithOAuth({ provider, options }: { provider: string; options?: any }) {
    try {
      const redirectUrl = options?.redirectTo || `${window.location.origin}/auth/callback`;
      account.createOAuth2Session(provider as any, redirectUrl, `${window.location.origin}/login`);
      return { data: { url: null }, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  },

  async signOut() {
    try {
      await account.deleteSession('current');
    } catch {
      // already signed out
    }
    authListeners.forEach(cb => cb('SIGNED_OUT', null));
  },

  async setSession({ access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    // Appwrite handles sessions differently — tokens come from OAuth redirect
    return { error: null };
  },

  async exchangeCodeForSession(code: string) {
    // Appwrite handles OAuth code exchange automatically
    try {
      const user = await account.get();
      const session = { user: { id: user.$id, email: user.email, user_metadata: { full_name: user.name } } };
      return { data: { session }, error: null };
    } catch (e: any) {
      return { data: { session: null }, error: { message: e.message } };
    }
  },

  onAuthStateChange(callback: AuthChangeCallback) {
    authListeners.push(callback);
    // Check current state
    account.get().then(user => {
      const session = { user: { id: user.$id, email: user.email, user_metadata: { full_name: user.name } } };
      callback('INITIAL_SESSION', session);
    }).catch(() => {
      // not signed in
    });

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners = authListeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  },
};

// ─── Main export (drop-in replacement for supabase client) ───
export const supabase = {
  from: (collection: string) => new QueryBuilder(collection),
  auth,
  storage: {
    from: (bucket: string) => new StorageBucketBuilder(bucket),
  },
};

// Re-export for backwards compatibility
export { API_URL, ENDPOINT, PROJECT_ID, DATABASE_ID };

// ─── Type stubs (backward compat with @supabase/supabase-js imports) ───
export type User = {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata?: Record<string, any>;
  aud?: string;
  created_at?: string;
};

export type AuthError = {
  message: string;
  status?: number;
  code?: string;
};

export type SupabaseClient = typeof supabase;
