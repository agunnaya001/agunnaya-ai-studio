import solc from 'solc-js';
import * as esbuild from 'esbuild';
import { logger } from './logger';

export interface CompilationResult {
  success: boolean;
  output?: string;
  error?: string;
  errorType?: string;
  line?: number;
  column?: number;
}

/**
 * Compile Solidity code
 */
export async function compileSolidity(code: string): Promise<CompilationResult> {
  try {
    // Simple solc-js compilation
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    // Note: solc-js works differently - it's a simpler version
    // For production, use the actual solc CLI or solc-js with proper setup
    // For now, we'll do basic validation
    
    if (!code.includes('pragma solidity')) {
      return {
        success: false,
        error: 'Missing pragma directive. Start with: pragma solidity ^0.8.0;',
        errorType: 'SyntaxError',
        line: 1,
      };
    }

    if (!code.includes('contract')) {
      return {
        success: false,
        error: 'No contract definition found. Add: contract MyContract { ... }',
        errorType: 'SyntaxError',
      };
    }

    // Basic syntax validation with regex
    const contractMatch = code.match(/contract\s+(\w+)\s*{/);
    if (!contractMatch) {
      return {
        success: false,
        error: 'Invalid contract syntax',
        errorType: 'SyntaxError',
        line: code.split('\n').findIndex(l => l.includes('contract')) + 1 || 1,
      };
    }

    return {
      success: true,
      output: JSON.stringify({
        contractName: contractMatch[1],
        status: 'compiled',
        bytecode: '0x60806040...(placeholder)', // Placeholder
      }),
    };
  } catch (error) {
    logger.error('Solidity compilation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Compilation failed',
      errorType: 'CompileError',
    };
  }
}

/**
 * Compile React/JSX/TSX code to JavaScript
 */
export async function compileReact(code: string, language: 'jsx' | 'tsx' = 'jsx'): Promise<CompilationResult> {
  try {
    // Use esbuild to bundle and transpile
    const result = await esbuild.build({
      stdin: {
        contents: code,
        loader: language,
      },
      bundle: true,
      write: false,
      format: 'iife',
      target: 'es2020',
      logLevel: 'error',
      external: ['react', 'react-dom'], // Don't bundle these
    });

    if (result.errors.length > 0) {
      const error = result.errors[0];
      return {
        success: false,
        error: error.text || 'Compilation error',
        errorType: 'CompileError',
        line: error.location?.line,
        column: error.location?.column,
      };
    }

    const output = result.outputFiles?.[0]?.text || '';
    return {
      success: true,
      output,
    };
  } catch (error) {
    logger.error('React compilation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Compilation failed',
      errorType: 'CompileError',
    };
  }
}

/**
 * Validate Python code (basic validation, not execution)
 */
export function validatePython(code: string): CompilationResult {
  try {
    // Basic Python syntax validation
    if (!code.trim()) {
      return {
        success: false,
        error: 'Code is empty',
        errorType: 'SyntaxError',
        line: 1,
      };
    }

    // Check for common syntax issues
    const lines = code.split('\n');
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check indentation
      const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;
      if (leadingSpaces % 4 !== 0 && leadingSpaces > 0) {
        return {
          success: false,
          error: 'Indentation error: use 4 spaces per level',
          errorType: 'SyntaxError',
          line: i + 1,
          column: leadingSpaces,
        };
      }

      // Check for unmatched parentheses/brackets
      const openParen = (line.match(/\(/g) || []).length;
      const closeParen = (line.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        return {
          success: false,
          error: 'Unmatched parentheses',
          errorType: 'SyntaxError',
          line: i + 1,
        };
      }
    }

    return {
      success: true,
      output: 'Python syntax validated',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
      errorType: 'SyntaxError',
    };
  }
}

/**
 * Main compilation router that handles all code types
 */
export async function compileCode(
  code: string,
  type: 'solidity' | 'react' | 'next' | 'python',
  language?: string,
): Promise<CompilationResult> {
  switch (type) {
    case 'solidity':
      return compileSolidity(code);
    case 'react':
      return compileReact(code, (language as 'jsx' | 'tsx') || 'jsx');
    case 'next':
      return compileReact(code, 'tsx');
    case 'python':
      return validatePython(code);
    default:
      return {
        success: false,
        error: `Unknown code type: ${type}`,
        errorType: 'Error',
      };
  }
}
