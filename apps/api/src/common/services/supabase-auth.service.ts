import { Injectable, Logger } from '@nestjs/common';

export interface SupabaseSyncResult {
  synced: boolean;
  supabaseUserId?: string;
  isExistingUser?: boolean;
  error?: string;
}

export interface CitizenSyncInput {
  email: string;
  govIdNumber: string;
  displayName: string;
  profession?: string;
  password?: string;
  role?: string;
}

@Injectable()
export class SupabaseAuthService {
  private readonly logger = new Logger(SupabaseAuthService.name);

  private get supabaseUrl(): string {
    return process.env.SUPABASE_URL || 'https://qbhwplseiiqprbvcdgkr.supabase.co';
  }

  private get serviceRoleKey(): string | undefined {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  private get anonKey(): string | undefined {
    return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  /**
   * Returns whether the Supabase Auth Admin integration is configured with a service role key.
   */
  isConfigured(): boolean {
    return Boolean(this.serviceRoleKey);
  }

  /**
   * Lists all users currently registered in Supabase Auth (auth.users).
   */
  async listUsers(page: number = 1, perPage: number = 100): Promise<any[]> {
    if (!this.serviceRoleKey) return [];
    try {
      const listEndpoint = `${this.supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${perPage}`;
      const res = await fetch(listEndpoint, {
        method: 'GET',
        headers: {
          apikey: this.serviceRoleKey,
          Authorization: `Bearer ${this.serviceRoleKey}`,
        },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data?.users || [];
    } catch (err: any) {
      this.logger.error(`[SUPABASE AUTH] Error listing users: ${err.message}`);
      return [];
    }
  }

  /**
   * Looks up a user in Supabase Auth by their email address.
   */
  async findUserByEmail(email: string): Promise<any | null> {
    const users = await this.listUsers(1, 100);
    const match = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    return match || null;
  }

  /**
   * Validates user credentials directly against Supabase Auth GoTrue API.
   */
  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    const anonKey = this.anonKey;
    if (!anonKey) {
      const user = await this.findUserByEmail(email);
      return { success: Boolean(user), user: user || undefined };
    }

    try {
      const tokenEndpoint = `${this.supabaseUrl}/auth/v1/token?grant_type=password`;
      const res = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data?.user) {
        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data?.error_description || data?.msg || data?.message || 'Invalid credentials in Supabase Auth',
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Synchronizes an ARTHAX Sovereign Citizen into Supabase Auth (`auth.users`).
   * Sets email_confirm: true, maps display metadata, and assigns sovereign role to app_metadata.
   */
  async syncCitizenToSupabaseAuth(citizen: CitizenSyncInput): Promise<SupabaseSyncResult> {
    if (!this.serviceRoleKey) {
      this.logger.warn(
        `[SUPABASE AUTH] SUPABASE_SERVICE_ROLE_KEY is not configured in .env. Skipping cloud auth sync for ${citizen.email}.`,
      );
      return {
        synced: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY_MISSING',
      };
    }

    const adminEndpoint = `${this.supabaseUrl}/auth/v1/admin/users`;

    try {
      this.logger.log(`[SUPABASE AUTH] Syncing citizen ${citizen.email} (${citizen.govIdNumber}) to auth.users...`);

      const payload = {
        email: citizen.email,
        password: citizen.password || `Sovereign@${citizen.govIdNumber}!2026`,
        email_confirm: true,
        user_metadata: {
          displayName: citizen.displayName,
          profession: citizen.profession || 'Citizen',
          govIdNumber: citizen.govIdNumber,
        },
        app_metadata: {
          role: citizen.role || 'USER',
          govId: citizen.govIdNumber,
          provider: 'arthax_sovereign',
        },
      };

      const response = await fetch(adminEndpoint, {
        method: 'POST',
        headers: {
          apikey: this.serviceRoleKey,
          Authorization: `Bearer ${this.serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data?.id) {
        this.logger.log(
          `[SUPABASE AUTH] Successfully provisioned citizen in Supabase auth.users (ID: ${data.id})`,
        );
        return {
          synced: true,
          supabaseUserId: data.id,
          isExistingUser: false,
        };
      }

      // If user already exists in auth.users, fetch and update their metadata
      if (
        response.status === 422 ||
        data?.msg?.includes('already been registered') ||
        data?.message?.includes('already registered')
      ) {
        this.logger.log(
          `[SUPABASE AUTH] User ${citizen.email} already registered in auth.users. Updating sovereign metadata...`,
        );
        return await this.updateExistingSupabaseUser(citizen);
      }

      const errMsg = data?.message || data?.msg || JSON.stringify(data);
      this.logger.error(`[SUPABASE AUTH] Failed to sync ${citizen.email}: ${errMsg}`);
      return {
        synced: false,
        error: errMsg,
      };
    } catch (err: any) {
      this.logger.error(`[SUPABASE AUTH] Network/Exception during sync: ${err.message}`);
      return {
        synced: false,
        error: err.message,
      };
    }
  }

  /**
   * Updates an existing Supabase Auth user's metadata and credentials if they already exist.
   */
  private async updateExistingSupabaseUser(citizen: CitizenSyncInput): Promise<SupabaseSyncResult> {
    try {
      // Find user ID by querying users list
      const listEndpoint = `${this.supabaseUrl}/auth/v1/admin/users?page=1&per_page=50`;
      const listRes = await fetch(listEndpoint, {
        method: 'GET',
        headers: {
          apikey: this.serviceRoleKey!,
          Authorization: `Bearer ${this.serviceRoleKey!}`,
        },
      });

      if (!listRes.ok) {
        return { synced: false, error: 'LIST_USERS_FAILED' };
      }

      const listData = await listRes.json();
      const users: any[] = listData?.users || [];
      const match = users.find((u) => u.email?.toLowerCase() === citizen.email.toLowerCase());

      if (!match?.id) {
        return { synced: true, isExistingUser: true };
      }

      const updateEndpoint = `${this.supabaseUrl}/auth/v1/admin/users/${match.id}`;
      const updatePayload: Record<string, any> = {
        email_confirm: true,
        user_metadata: {
          ...match.user_metadata,
          displayName: citizen.displayName,
          profession: citizen.profession || match.user_metadata?.profession,
          govIdNumber: citizen.govIdNumber,
        },
        app_metadata: {
          ...match.app_metadata,
          role: citizen.role || match.app_metadata?.role || 'USER',
          govId: citizen.govIdNumber,
          provider: 'arthax_sovereign',
        },
      };

      if (citizen.password) {
        updatePayload.password = citizen.password;
      }

      const updateRes = await fetch(updateEndpoint, {
        method: 'PUT',
        headers: {
          apikey: this.serviceRoleKey!,
          Authorization: `Bearer ${this.serviceRoleKey!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (updateRes.ok) {
        this.logger.log(`[SUPABASE AUTH] Successfully updated metadata for citizen ${citizen.email}`);
        return {
          synced: true,
          supabaseUserId: match.id,
          isExistingUser: true,
        };
      }

      return { synced: true, isExistingUser: true };
    } catch (err: any) {
      this.logger.warn(`[SUPABASE AUTH] Warning during user update: ${err.message}`);
      return { synced: false, error: err.message };
    }
  }
}
