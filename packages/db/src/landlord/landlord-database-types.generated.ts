import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface EmailVerificationCode {
  code: string;
  createdAt: Generated<string>;
  email: string;
  expiresAt: string;
  id: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface PasswordResetToken {
  createdAt: Generated<string>;
  expiresAt: string;
  id: string;
  tokenHash: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface Session {
  createdAt: Generated<string>;
  expiresAt: number;
  id: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface Tenant {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  domain: string;
  id: string;
  name: string;
  updatedAt: Generated<string>;
}

export interface TenantDatabase {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  encryptedAuthToken: string | null;
  id: string;
  tenantId: string;
  updatedAt: Generated<string>;
  url: string;
}

export interface User {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  email: string;
  emailVerified: Generated<number>;
  firstName: string;
  id: string;
  lastName: string;
  passwordHash: string;
  updatedAt: Generated<string>;
  username: string;
}

export interface DB {
  emailVerificationCode: EmailVerificationCode;
  passwordResetToken: PasswordResetToken;
  session: Session;
  tenant: Tenant;
  tenantDatabase: TenantDatabase;
  user: User;
}
