import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

// Mirrors the public.profiles table created by supabase/migrations/001_profiles.sql
// The `id` column is a foreign key to auth.users(id) — managed by Supabase Auth.
export const profilesTable = pgTable('profiles', {
  id:          uuid('id').primaryKey(),
  email:       text('email'),
  displayName: text('display_name'),
  avatarUrl:   text('avatar_url'),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const selectProfileSchema = createSelectSchema(profilesTable)
export const insertProfileSchema = createInsertSchema(profilesTable).omit({ createdAt: true, updatedAt: true })
export const updateProfileSchema = insertProfileSchema.partial().omit({ id: true })

export type Profile    = z.infer<typeof selectProfileSchema>
export type NewProfile = z.infer<typeof insertProfileSchema>
