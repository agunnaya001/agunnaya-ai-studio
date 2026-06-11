import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core'
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

// Phase 4: Live Preview System Tables

// Stores live preview sessions for Solidity, React, and Next.js code
export const previewsTable = pgTable('previews', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => profilesTable.id),
  projectId:   uuid('project_id'), // optional link to projects
  code:        text('code').notNull(), // source code
  language:    text('language').notNull(), // 'sol', 'tsx', 'jsx', 'py'
  type:        text('type').notNull(), // 'solidity', 'react', 'next', 'python'
  status:      text('status').notNull().default('idle'), // 'idle', 'compiling', 'running', 'error'
  error:       text('error'), // compile/runtime error message
  output:      text('output'), // preview HTML/JSON output
  shareToken:  text('share_token').unique(), // public share link token
  expiresAt:   timestamp('expires_at', { withTimezone: true }), // auto-cleanup after configured days
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const selectPreviewSchema = createSelectSchema(previewsTable)
export const insertPreviewSchema = createInsertSchema(previewsTable).omit({ createdAt: true, updatedAt: true, id: true })
export const updatePreviewSchema = insertPreviewSchema.partial()

export type Preview    = z.infer<typeof selectPreviewSchema>
export type NewPreview = z.infer<typeof insertPreviewSchema>

// Tracks all contract deployments across chains
export const deploymentLogsTable = pgTable('deployment_logs', {
  id:           uuid('id').primaryKey().defaultRandom(),
  userId:       uuid('user_id').notNull().references(() => profilesTable.id),
  contractName: text('contract_name').notNull(),
  network:      text('network').notNull(), // 'base-sepolia', 'ethereum', 'polygon', etc.
  txHash:       text('tx_hash'), // transaction hash
  address:      text('address'), // deployed contract address
  status:       text('status').notNull().default('pending'), // 'pending', 'confirmed', 'failed'
  gasUsed:      text('gas_used'), // actual gas used
  blockNumber:  integer('block_number'), // block where deployed
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const selectDeploymentLogSchema = createSelectSchema(deploymentLogsTable)
export const insertDeploymentLogSchema = createInsertSchema(deploymentLogsTable).omit({ createdAt: true, updatedAt: true, id: true })
export const updateDeploymentLogSchema = insertDeploymentLogSchema.partial()

export type DeploymentLog    = z.infer<typeof selectDeploymentLogSchema>
export type NewDeploymentLog = z.infer<typeof insertDeploymentLogSchema>

// Stores errors and AI-powered suggestions for debugging
export const errorsTable = pgTable('errors', {
  id:           uuid('id').primaryKey().defaultRandom(),
  userId:       uuid('user_id').notNull().references(() => profilesTable.id),
  previewId:    uuid('preview_id').references(() => previewsTable.id), // link to preview that caused error
  code:         text('code').notNull(), // code snippet that caused error
  errorMessage: text('error_message').notNull(), // full error message
  errorType:    text('error_type').notNull(), // 'SyntaxError', 'RuntimeError', 'CompileError', 'TypeError'
  line:         integer('line'), // line number
  column:       integer('column'), // column number
  suggestions:  text('suggestions'), // AI-generated fix suggestions (JSON stringified)
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const selectErrorSchema = createSelectSchema(errorsTable)
export const insertErrorSchema = createInsertSchema(errorsTable).omit({ createdAt: true, id: true })
export const updateErrorSchema = insertErrorSchema.partial()

export type AppError    = z.infer<typeof selectErrorSchema>
export type NewAppError = z.infer<typeof insertErrorSchema>
