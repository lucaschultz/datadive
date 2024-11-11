import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface CellTemplate {
  code: string;
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  description: string | null;
  id: string;
  title: string;
  updatedAt: Generated<string>;
}

export interface CellTemplateInput {
  cellTemplateId: string;
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  description: string | null;
  id: string;
  inputId: string;
  label: string;
  placeholder: string | null;
  required: number | null;
  updatedAt: Generated<string>;
}

export interface Collaborator {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  id: string;
  projectId: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface EmailVerificationCode {
  code: string;
  createdAt: Generated<string>;
  email: string;
  expiresAt: string;
  id: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface Input {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  description: string;
  id: string;
  title: string;
  type: string;
  updatedAt: Generated<string>;
}

export interface InputType {
  id: string;
}

export interface Notebook {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  id: string;
  path: string;
  projectId: string;
  status: string;
  title: string;
  updatedAt: Generated<string>;
}

export interface NotebookStatus {
  id: string;
}

export interface PasswordResetToken {
  createdAt: Generated<string>;
  expiresAt: string;
  id: string;
  tokenHash: string;
  updatedAt: Generated<string>;
  userId: string;
}

export interface Project {
  createdAt: Generated<string>;
  deletedAt: Generated<string | null>;
  id: string;
  ownerId: string;
  title: string;
  updatedAt: Generated<string>;
}

export interface Session {
  createdAt: Generated<string>;
  expiresAt: number;
  id: string;
  updatedAt: Generated<string>;
  userId: string;
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
  cellTemplate: CellTemplate;
  cellTemplateInput: CellTemplateInput;
  collaborator: Collaborator;
  emailVerificationCode: EmailVerificationCode;
  input: Input;
  inputType: InputType;
  notebook: Notebook;
  notebookStatus: NotebookStatus;
  passwordResetToken: PasswordResetToken;
  project: Project;
  session: Session;
  user: User;
}
