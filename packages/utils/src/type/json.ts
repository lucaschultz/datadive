export type JsonArray = Array<Json>

export interface JsonObject {
  [key: string]: Json
}

export type JsonPrimitive = string | number | boolean | null

export type Json = JsonPrimitive | JsonArray | JsonObject
