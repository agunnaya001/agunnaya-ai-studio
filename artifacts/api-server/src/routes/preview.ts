import { Router, Request, Response } from 'express';
import { compileCode, CompilationResult } from '../lib/compiler';
import { logger } from '../lib/logger';
import crypto from 'crypto';

const router = Router();

interface PreviewRequest {
  code: string;
  type: 'solidity' | 'react' | 'next' | 'python';
  language?: string;
}

interface PreviewResponse {
  id: string;
  status: 'idle' | 'compiling' | 'running' | 'error';
  compilation: CompilationResult;
  shareToken?: string;
  output?: string;
  error?: string;
}

/**
 * POST /api/preview/compile
 * Compile code and return compilation result
 */
router.post('/compile', async (req: Request, res: Response) => {
  try {
    const { code, type, language } = req.body as PreviewRequest;

    if (!code || !type) {
      return res.status(400).json({
        error: 'Missing required fields: code, type',
      });
    }

    logger.info(`Compiling ${type} code`);

    const result = await compileCode(code, type, language);

    const previewId = crypto.randomUUID();
    const shareToken = crypto.randomBytes(16).toString('hex');

    const response: PreviewResponse = {
      id: previewId,
      status: result.success ? 'running' : 'error',
      compilation: result,
      shareToken,
      output: result.output,
      error: result.error,
    };

    res.json(response);
  } catch (error) {
    logger.error('Compilation endpoint error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * POST /api/preview/execute
 * Execute code in a sandboxed environment
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { code, type } = req.body as PreviewRequest;

    if (!code || !type) {
      return res.status(400).json({
        error: 'Missing required fields: code, type',
      });
    }

    logger.info(`Executing ${type} code`);

    // For now, just compile and return
    // Full sandbox execution would use vm2 and proper isolation
    const result = await compileCode(code, type);

    res.json({
      status: result.success ? 'success' : 'error',
      output: result.output,
      error: result.error,
    });
  } catch (error) {
    logger.error('Execution endpoint error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/preview/share/:token
 * Get preview by share token (public endpoint)
 */
router.get('/share/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    logger.info(`Fetching preview by share token`);

    // This would query the database for the preview with the given share token
    // For now, return a mock response
    res.json({
      id: 'preview-123',
      token,
      code: 'pragma solidity ^0.8.0;\\n\\ncontract Example { }',
      language: 'solidity',
      type: 'solidity',
      status: 'running',
      output: JSON.stringify({ contractName: 'Example' }),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Share token error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/preview/:id
 * Get preview details by ID (stub for now)
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching preview ${id}`);

    // In Phase 4E, this would fetch from the database
    res.json({
      id,
      status: 'running',
      message: 'Preview endpoint - database integration coming in Phase 4E',
    });
  } catch (error) {
    logger.error('Get preview error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
