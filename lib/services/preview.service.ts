'use server'

import { db } from '@/lib/db'
import {
  previewsTable,
  deploymentLogsTable,
  errorsTable,
  type NewPreview,
  type NewDeploymentLog,
  type NewAppError,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import crypto from 'crypto'

/**
 * Create a new preview session
 */
export async function createPreview(
  userId: string,
  data: Omit<NewPreview, 'userId'>,
): Promise<any> {
  try {
    const shareToken = crypto.randomBytes(16).toString('hex')
    const result = await db.insert(previewsTable).values({
      userId,
      shareToken,
      ...data,
    } as NewPreview).returning()
    return result[0]
  } catch (error) {
    console.error('[v0] Error creating preview:', error)
    throw error
  }
}

/**
 * Get preview by ID (with user check)
 */
export async function getPreviewById(
  previewId: string,
  userId?: string,
): Promise<any> {
  try {
    const where = userId 
      ? and(eq(previewsTable.id, previewId), eq(previewsTable.userId, userId))
      : eq(previewsTable.id, previewId)
    
    const result = await db
      .select()
      .from(previewsTable)
      .where(where)
      .limit(1)
    
    return result[0] || null
  } catch (error) {
    console.error('[v0] Error getting preview:', error)
    throw error
  }
}

/**
 * Get preview by share token (public access)
 */
export async function getPreviewByShareToken(shareToken: string): Promise<any> {
  try {
    const result = await db
      .select()
      .from(previewsTable)
      .where(eq(previewsTable.shareToken, shareToken))
      .limit(1)
    
    return result[0] || null
  } catch (error) {
    console.error('[v0] Error getting preview by token:', error)
    throw error
  }
}

/**
 * Update preview with compilation result
 */
export async function updatePreviewResult(
  previewId: string,
  userId: string,
  data: {
    status: 'idle' | 'compiling' | 'running' | 'error'
    output?: string
    error?: string
  },
): Promise<any> {
  try {
    const result = await db
      .update(previewsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(previewsTable.id, previewId),
          eq(previewsTable.userId, userId),
        ),
      )
      .returning()
    
    return result[0] || null
  } catch (error) {
    console.error('[v0] Error updating preview:', error)
    throw error
  }
}

/**
 * List user's previews
 */
export async function listUserPreviews(userId: string, limit = 20): Promise<any[]> {
  try {
    return await db
      .select()
      .from(previewsTable)
      .where(eq(previewsTable.userId, userId))
      .orderBy((table) => ({ createdAt: 'desc' }))
      .limit(limit)
  } catch (error) {
    console.error('[v0] Error listing previews:', error)
    throw error
  }
}

/**
 * Delete preview
 */
export async function deletePreview(previewId: string, userId: string): Promise<boolean> {
  try {
    const result = await db
      .delete(previewsTable)
      .where(
        and(
          eq(previewsTable.id, previewId),
          eq(previewsTable.userId, userId),
        ),
      )
    
    return !!result
  } catch (error) {
    console.error('[v0] Error deleting preview:', error)
    throw error
  }
}

/**
 * Create deployment log
 */
export async function createDeploymentLog(
  userId: string,
  data: Omit<NewDeploymentLog, 'userId'>,
): Promise<any> {
  try {
    const result = await db
      .insert(deploymentLogsTable)
      .values({
        userId,
        ...data,
      } as NewDeploymentLog)
      .returning()
    
    return result[0]
  } catch (error) {
    console.error('[v0] Error creating deployment log:', error)
    throw error
  }
}

/**
 * Update deployment status
 */
export async function updateDeploymentStatus(
  deploymentId: string,
  userId: string,
  data: {
    status: 'pending' | 'confirmed' | 'failed'
    txHash?: string
    address?: string
    gasUsed?: string
    blockNumber?: number
  },
): Promise<any> {
  try {
    const result = await db
      .update(deploymentLogsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(deploymentLogsTable.id, deploymentId),
          eq(deploymentLogsTable.userId, userId),
        ),
      )
      .returning()
    
    return result[0] || null
  } catch (error) {
    console.error('[v0] Error updating deployment:', error)
    throw error
  }
}

/**
 * Get deployment history for user
 */
export async function getDeploymentHistory(userId: string, limit = 50): Promise<any[]> {
  try {
    return await db
      .select()
      .from(deploymentLogsTable)
      .where(eq(deploymentLogsTable.userId, userId))
      .orderBy((table) => ({ createdAt: 'desc' }))
      .limit(limit)
  } catch (error) {
    console.error('[v0] Error getting deployment history:', error)
    throw error
  }
}

/**
 * Log an error
 */
export async function logError(
  userId: string,
  data: Omit<NewAppError, 'userId'>,
): Promise<any> {
  try {
    const result = await db
      .insert(errorsTable)
      .values({
        userId,
        ...data,
      } as NewAppError)
      .returning()
    
    return result[0]
  } catch (error) {
    console.error('[v0] Error logging error:', error)
    throw error
  }
}

/**
 * Get recent errors for user
 */
export async function getUserErrors(userId: string, limit = 20): Promise<any[]> {
  try {
    return await db
      .select()
      .from(errorsTable)
      .where(eq(errorsTable.userId, userId))
      .orderBy((table) => ({ createdAt: 'desc' }))
      .limit(limit)
  } catch (error) {
    console.error('[v0] Error getting user errors:', error)
    throw error
  }
}
