import { Router, Request, Response } from 'express';
import { analyzeError, formatErrorDisplay, suggestCodeFixes, ErrorAnalysis } from '../lib/error-handler';
import { logger } from '../lib/logger';

const router = Router();

interface DebugRequest {
  code: string;
  error: string;
  language: 'solidity' | 'jsx' | 'tsx' | 'python' | 'javascript';
  line?: number;
  column?: number;
}

interface DebugResponse {
  analysis: ErrorAnalysis;
  suggestions: string[];
  formatted: string;
}

/**
 * POST /api/debug/analyze
 * Analyze an error and provide AI-powered suggestions
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { code, error, language, line, column } = req.body as DebugRequest;

    if (!code || !error || !language) {
      return res.status(400).json({
        error: 'Missing required fields: code, error, language',
      });
    }

    logger.info(`Analyzing error in ${language} code`);

    // Analyze the error
    const analysis = analyzeError(error, code, language, line);

    // Get fix suggestions
    const suggestions = suggestCodeFixes(code, error, line);

    // Format for display
    const formatted = formatErrorDisplay(analysis);

    const response: DebugResponse = {
      analysis,
      suggestions,
      formatted,
    };

    res.json(response);
  } catch (error) {
    logger.error('Debug analysis error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * POST /api/debug/fix
 * Get specific code fix suggestions
 */
router.post('/fix', async (req: Request, res: Response) => {
  try {
    const { code, error, language } = req.body as DebugRequest;

    if (!code || !error || !language) {
      return res.status(400).json({
        error: 'Missing required fields: code, error, language',
      });
    }

    logger.info(`Getting fixes for ${language} error`);

    const fixes = suggestCodeFixes(code, error);

    // Generate a corrected code suggestion
    let correctedCode = code;
    
    if (language === 'solidity' && !code.includes('pragma solidity')) {
      correctedCode = 'pragma solidity ^0.8.0;\n\n' + correctedCode;
    }

    if (['jsx', 'tsx', 'javascript'].includes(language) && !code.includes('import React')) {
      correctedCode = 'import React from "react";\n\n' + correctedCode;
    }

    if (!code.includes('export') && ['jsx', 'tsx'].includes(language)) {
      correctedCode = correctedCode + '\n\nexport default YourComponent;';
    }

    res.json({
      fixes,
      correctedCode,
      message: 'Suggested fixes generated',
    });
  } catch (error) {
    logger.error('Fix generation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
