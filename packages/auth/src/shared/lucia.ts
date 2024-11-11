// import type {
//   LandlordDatabaseSchema,
//   LandlordKysely,
//   Selectable,
// } from '@datadive/db'
// import type { ResultAsync } from 'neverthrow'
// import type { LandlordAuthInjection } from '../utility/define-auth-function'

// import { sha256 } from '@oslojs/crypto/sha2'
// import {
//   encodeBase32LowerCaseNoPadding,
//   encodeHexLowerCase,
// } from '@oslojs/encoding'
// import { Cookie } from 'lucia'
// import { err, ok, safeTry } from 'neverthrow'
// import { createDate, TimeSpan } from 'oslo'

// import {
//   DbError,
//   execute,
//   executeTakeFirst,
//   LandlordTable,
//   TenantTable,
// } from '@datadive/db'
// import { omit } from '@datadive/utils/common'

// import { InvalidSessionError } from '../error/invalid-session-error'

// export function generateSessionToken(): string {
//   const bytes = new Uint8Array(20)
//   crypto.getRandomValues(bytes)
//   const token = encodeBase32LowerCaseNoPadding(bytes)
//   return token
// }

// type SessionInserter = (
//   session: Session,
// ) => ResultAsync<Session, DbError.NoQueryResult | DbError.QueryFailed>

// export function insertLandlordSession(
//   injection: { db: LandlordKysely },
//   params: { session: Session },
// ): ResultAsync<Session, DbError.NoQueryResult | DbError.QueryFailed> {
//   const { db } = injection
//   return executeTakeFirst(
//     db
//       .insertInto(LandlordTable.Session)
//       .values({
//         id: params.session.id,
//         userId: params.session.userId,
//         expiresAt: Math.floor(params.session.expiresAt.getTime() / 1000),
//       })
//       .returningAll(),
//   ).map((insertResult) => ({
//     ...insertResult,
//     expiresAt: new Date(insertResult.expiresAt * 1000),
//   }))
// }

// export function createSession(
//   injection: { insertSession: SessionInserter },
//   params: {
//     token: string
//     userId: string
//     daysValid?: number | undefined
//   },
// ): ResultAsync<Session, DbError.NoQueryResult | DbError.QueryFailed> {
//   const { insertSession } = injection

//   const sessionId = encodeHexLowerCase(
//     sha256(new TextEncoder().encode(params.token)),
//   )

//   const session: Session = {
//     id: sessionId,
//     userId: params.userId,
//     expiresAt: createDate(new TimeSpan(params.daysValid ?? 30, 'd')),
//   }

//   return insertSession(session)
// }

// type SessionSelector<TUser> = (
//   sessionId: string,
// ) => ResultAsync<
//   { session: Session; user: TUser },
//   DbError.QueryFailed | DbError.NoQueryResult
// >

// function selectLandlordSessionAndUser(
//   injection: {
//     db: LandlordKysely
//   },
//   params: { sessionId: string },
// ): ResultAsync<
//   { session: Session; user: Selectable<LandlordDatabaseSchema, 'user'> },
//   DbError.NoQueryResult | DbError.QueryFailed
// > {
//   const { db } = injection
//   return executeTakeFirst(
//     db
//       .selectFrom(LandlordTable.Session)
//       .innerJoin(LandlordTable.User, 'user.id', 'session.userId')
//       .where('session.id', '=', params.sessionId)
//       .selectAll('user')
//       .select([
//         'session.id as sessionId',
//         'session.expiresAt as sessionExpiresAt',
//       ]),
//   ).map((result) => {
//     return {
//       session: {
//         id: result.sessionId,
//         userId: result.id,
//         expiresAt: new Date(result.sessionExpiresAt * 1000),
//       } satisfies Session,
//       user: {
//         ...omit(result, ['sessionId', 'sessionExpiresAt']),
//       } satisfies Selectable<LandlordDatabaseSchema, 'user'>,
//     }
//   })
// }

// // function deleteLandlordSession(
// //   injection: { db: LandlordKysely },
// //   sessionId: string,
// // ): ResultAsync<true, DbError.QueryFailed> {
// //   const { db } = injection
// //   return executeTakeFirst(
// //     db.deleteFrom(LandlordTable.Session).where('id', '=', sessionId),
// //   ).map((result) => result.numDeletedRows === 1)
// // }

// export function validateSessionToken<TUser>(
//   injection: { selectSessionAndUser: SessionSelector<TUser> },
//   token: string,
// ): ResultAsync<
//   { session: Session; user: TUser },
//   DbError.QueryFailed | InvalidSessionError
// > {
//   return safeTry(async function* () {
//     const { session, user } = yield* injection
//       .selectSessionAndUser(token)
//       .mapErr((err) => {
//         if (err instanceof DbError.NoQueryResult) {
//           return new InvalidSessionError(
//             new Cookie('test', 'test', { httpOnly: true }),
//           )
//         }
//         return err
//       })
//       .safeUnwrap()

//     if (Date.now() >= session.expiresAt.getTime()) {
//       return err(
//         new InvalidSessionError(new Cookie('test', 'test', { httpOnly: true })),
//       )
//     }

//     return ok({ session, user })
//   })
// }

// export function invalidateSession(sessionId: string): void {
//   // TODO
// }

// export type SessionValidationResult =
//   | { session: Session; user: User }
//   | { session: null; user: null }

// export interface Session {
//   id: string
//   userId: string
//   expiresAt: Date
// }

// export interface User {
//   id: number
// }
