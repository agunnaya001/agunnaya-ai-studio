import { logger } from './logger';

export interface ErrorSuggestion {
  message: string;
  fix: string;
  example: string;
}

export interface ErrorAnalysis {
  type: string;
  message: string;
  line?: number;
  column?: number;
  suggestions: ErrorSuggestion[];
  severity: 'error' | 'warning' | 'info';
}

/**
 * Common Solidity error patterns and fixes
 */
const solidityPatterns = [
  {
    pattern: /Undeclared identifier|undefined variable/i,
    fix: 'Variable is not declared. Check spelling or declare it with: type variableName;',
    example: 'uint256 myVar = 10;',
  },
  {
    pattern: /No matching function|undefined method/i,
    fix: 'Function does not exist. Check the spelling and signature of the function call.',
    example: 'function myFunction() public { ... }',
  },
  {
    pattern: /Type mismatch|Invalid type/i,
    fix: 'Variable type does not match the expected type. Use explicit casting if needed.',
    example: 'uint256(myValue)',
  },
  {
    pattern: /Missing semicolon/i,
    fix: 'Add a semicolon at the end of the statement.',
    example: 'uint256 x = 10;',
  },
  {
    pattern: /pragma solidity/i,
    fix: 'Add pragma directive at the top: pragma solidity ^0.8.0;',
    example: 'pragma solidity ^0.8.0;\ncontract MyContract { }',
  },
];

/**
 * Common React/JSX error patterns and fixes
 */
const reactPatterns = [
  {
    pattern: /JSX element.+used as an expression/i,
    fix: 'Wrap JSX in parentheses or return statement.',
    example: 'return (<div>Hello</div>)',
  },
  {
    pattern: /React is not defined/i,
    fix: 'Import React: import React from "react"',
    example: "import React from 'react';",
  },
  {
    pattern: /Cannot find module/i,
    fix: 'Check the import path and ensure the module exists.',
    example: 'import { Component } from "./Component"',
  },
  {
    pattern: /Children must have a key prop/i,
    fix: 'Add unique key prop to list items.',
    example: '<div key={item.id}>{item.name}</div>',
  },
  {
    pattern: /Unterminated JSX element/i,
    fix: 'Close all JSX elements with matching closing tags.',
    example: '<div>Content</div>',
  },
];

/**
 * Common Python error patterns and fixes
 */
const pythonPatterns = [
  {
    pattern: /IndentationError/i,
    fix: 'Use consistent indentation (4 spaces per level).',
    example: 'def myFunc():\n    return 42',
  },
  {
    pattern: /NameError.*not defined/i,
    fix: 'Variable is not defined. Check spelling or assign a value first.',
    example: 'x = 10',
  },
  {
    pattern: /SyntaxError/i,
    fix: 'Check for syntax errors: missing colons, unclosed parentheses, etc.',
    example: 'if x > 5:  # Don\'t forget the colon',
  },
  {
    pattern: /TypeError.*unsupported operand/i,
    fix: 'Type mismatch in operation. Ensure types are compatible.',
    example: 'result = str(value) + str(other)',
  },
  {
    pattern: /ImportError|ModuleNotFoundError/i,
    fix: 'Module not found. Check the import name or install the package.',
    example: 'import os  # Built-in module',
  },
];

/**
 * Analyze an error and provide AI-powered suggestions
 */
export function analyzeError(
  errorMessage: string,
  code: string,
  language: 'solidity' | 'jsx' | 'tsx' | 'python' | 'javascript',
  line?: number,
): ErrorAnalysis {
  let patterns: typeof solidityPatterns;
  let severity: 'error' | 'warning' | 'info' = 'error';

  // Choose pattern set based on language
  if (language === 'solidity') {
    patterns = solidityPatterns;
  } else if (['jsx', 'tsx', 'javascript'].includes(language)) {
    patterns = reactPatterns;
  } else {
    patterns = pythonPatterns;
  }

  // Find matching patterns
  const suggestions: ErrorSuggestion[] = [];
  for (const pattern of patterns) {
    if (pattern.pattern.test(errorMessage)) {
      suggestions.push({
        message: pattern.fix,
        fix: pattern.fix,
        example: pattern.example,
      });
    }
  }

  // If no exact matches, provide generic suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      message: 'Check the error message and review the code syntax.',
      fix: 'Review the code around the error location.',
      example: 'Look for missing semicolons, parentheses, or keywords.',
    });
  }

  // Extract line number from error if possible
  let errorLine = line;
  if (!errorLine) {
    const lineMatch = errorMessage.match(/line (\d+)/i);
    if (lineMatch) {
      errorLine = parseInt(lineMatch[1], 10);
    }
  }

  return {
    type: extractErrorType(errorMessage),
    message: errorMessage,
    line: errorLine,
    suggestions,
    severity,
  };
}

/**
 * Extract error type from error message
 */
function extractErrorType(errorMessage: string): string {
  if (errorMessage.includes('SyntaxError')) return 'SyntaxError';
  if (errorMessage.includes('TypeError')) return 'TypeError';
  if (errorMessage.includes('ReferenceError')) return 'ReferenceError';
  if (errorMessage.includes('IndentationError')) return 'IndentationError';
  if (errorMessage.includes('Undeclared identifier')) return 'UndeclaredIdentifierError';
  if (errorMessage.includes('No matching function')) return 'FunctionNotFoundError';
  if (errorMessage.includes('CompileError') || errorMessage.includes('compilation failed'))
    return 'CompileError';
  return 'Error';
}

/**
 * Format error analysis for display
 */
export function formatErrorDisplay(analysis: ErrorAnalysis): string {
  let output = `[${analysis.severity.toUpperCase()}] ${analysis.type}\n`;
  output += `Message: ${analysis.message}\n`;

  if (analysis.line) {
    output += `Line: ${analysis.line}\n`;
  }

  if (analysis.suggestions.length > 0) {
    output += '\nSuggestions:\n';
    analysis.suggestions.forEach((s, i) => {
      output += `  ${i + 1}. ${s.fix}\n`;
      output += `     Example: ${s.example}\n`;
    });
  }

  return output;
}

/**
 * Suggest code fixes based on error
 */
export function suggestCodeFixes(
  code: string,
  errorMessage: string,
  line?: number,
): string[] {
  const fixes: string[] = [];

  // Check for common missing elements
  if (['solidity'].includes(errorMessage.toLowerCase()) || errorMessage.includes('pragma')) {
    if (!code.includes('pragma solidity')) {
      fixes.push('Add pragma solidity ^0.8.0; at the top');
    }
    if (!code.includes('contract')) {
      fixes.push('Add contract MyContract { }');
    }
  }

  if (['react', 'jsx', 'tsx'].some(t => errorMessage.toLowerCase().includes(t))) {
    if (!code.includes('import React')) {
      fixes.push('Add: import React from "react"');
    }
    if (!code.includes('export')) {
      fixes.push('Export your component: export default MyComponent');
    }
  }

  if (['python'].some(t => errorMessage.toLowerCase().includes(t))) {
    if (errorMessage.includes('IndentationError')) {
      fixes.push('Check indentation - use 4 spaces per level');
    }
    if (errorMessage.includes('NameError')) {
      fixes.push('Ensure variables are defined before use');
    }
  }

  return fixes.length > 0 ? fixes : ['Review the error message and code syntax'];
}
