'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';

export default function JsonPhpConverterClient() {
  const [mode, setMode] = useState<'json-to-php' | 'php-to-json'>('json-to-php');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('json_php_converter_mode') as
        | 'json-to-php'
        | 'php-to-json';
      const savedInput = localStorage.getItem('json_php_converter_input');

      if (savedMode) setMode(savedMode);
      if (savedInput) {
        setInput(savedInput);
        setTimeout(() => {
          performConversion(savedInput, savedMode || 'json-to-php');
        }, 0);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('json_php_converter_mode', mode);
      localStorage.setItem('json_php_converter_input', input);
    }
  }, [mode, input]);

  const performConversion = useCallback(
    (text: string, currentMode: 'json-to-php' | 'php-to-json') => {
      if (!text.trim()) {
        setOutput('');
        setError('');
        return;
      }

      try {
        if (currentMode === 'json-to-php') {
          const obj = JSON.parse(text);
          const phpArray = toPhpArrayString(obj);
          setOutput(phpArray);
          setError('');
        } else {
          const json = phpToJson(text);
          setOutput(json);
          setError('');
        }
      } catch (e: any) {
        setError(e.message || 'Conversion failed');
        setOutput('');
      }
    },
    []
  );

  useEffect(() => {
    performConversion(input, mode);
  }, [input, mode, performConversion]);

  const toPhpArrayString = (obj: any, indent = 0): string => {
    const spaces = ' '.repeat(indent);
    const innerSpaces = ' '.repeat(indent + 2);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map(item => toPhpArrayString(item, indent + 2));
      return `[\n${innerSpaces}${items.join(`,\n${innerSpaces}`)}\n${spaces}]`;
    } else if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '[]';
      const lines = entries.map(([key, value]) => {
        return `"${key}" => ${toPhpArrayString(value, indent + 2)}`;
      });
      return `[\n${innerSpaces}${lines.join(`,\n${innerSpaces}`)}\n${spaces}]`;
    } else if (typeof obj === 'string') {
      return `"${obj.replace(/"/g, '\\"')}"`;
    } else if (typeof obj === 'boolean') {
      return obj ? 'true' : 'false';
    } else if (obj === null) {
      return 'null';
    } else {
      return String(obj);
    }
  };

  const phpToJson = (phpStr: string): string => {
    let index = 0;
    const str = phpStr.trim();
    
    function skipWhitespace() {
      while (index < str.length) {
        const char = str[index];
        if (/\s/.test(char)) {
          index++;
        } else if (char === '/' && str[index + 1] === '/') {
          while (index < str.length && str[index] !== '\n') index++;
        } else if (char === '/' && str[index + 1] === '*') {
          index += 2;
          while (index < str.length && !(str[index] === '*' && str[index + 1] === '/')) index++;
          index += 2;
        } else if (char === '#') {
          while (index < str.length && str[index] !== '\n') index++;
        } else {
          break;
        }
      }
    }
    
    function parseValue(): any {
      skipWhitespace();
      if (index >= str.length) return null;
      
      const char = str[index];
      if (char === '[') {
        return parseArray();
      } else if (char === '"' || char === "'") {
        return parseString();
      } else if (/[0-9-]/.test(char)) {
        return parseNumber();
      } else if (str.startsWith('true', index)) {
        index += 4;
        return true;
      } else if (str.startsWith('false', index)) {
        index += 5;
        return false;
      } else if (str.startsWith('null', index)) {
        index += 4;
        return null;
      } else if (str.startsWith('array', index)) {
        index += 5;
        skipWhitespace();
        if (str[index] === '(') {
          return parseArray(')');
        }
      }
      throw new Error(`Unexpected character at position ${index}: ${char}`);
    }
    
    function parseString(): string {
      const quote = str[index++];
      let result = '';
      while (index < str.length && str[index] !== quote) {
        if (str[index] === '\\') {
          index++;
        }
        result += str[index++];
      }
      index++;
      return result;
    }
    
    function parseNumber(): number {
      let result = '';
      while (index < str.length && /[0-9.eE-]/.test(str[index])) {
        result += str[index++];
      }
      return Number(result);
    }
    
    function parseArray(closeChar = ']'): any {
      index++;
      skipWhitespace();
      
      const resultObj: Record<string, any> = {};
      const resultArr: any[] = [];
      let isAssoc = false;
      
      while (index < str.length && str[index] !== closeChar) {
        skipWhitespace();
        if (str[index] === closeChar) break;
        
        const keyOrValue = parseValue();
        skipWhitespace();
        
        if (str.startsWith('=>', index)) {
          isAssoc = true;
          index += 2;
          const value = parseValue();
          resultObj[String(keyOrValue)] = value;
        } else {
          resultArr.push(keyOrValue);
        }
        
        skipWhitespace();
        if (str[index] === ',') {
          index++;
        }
      }
      index++;
      
      return isAssoc ? resultObj : resultArr;
    }
    
    try {
      const result = parseValue();
      return JSON.stringify(result, null, 2);
    } catch (e: any) {
      throw new Error(`Failed to parse PHP array: ${e.message}`);
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'json-to-php' ? 'php-to-json' : 'json-to-php'));
    if (output && !error) {
      setInput(output);
    }
  };

  return (
    <ToolPageLayout
      title="JSON ⇄ PHP Array Converter"
      description="Convert JSON to PHP Array and vice versa. State is saved locally."
      category="utility"
      keywords={['json to php array', 'php array to json', 'php array converter']}
      maxWidth="max-w-7xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {mode === 'json-to-php' ? 'JSON Input' : 'PHP Array Input'}
            </label>
            <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Switch Direction
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              mode === 'json-to-php' ? '{\n  "key": "value"\n}' : "[\n  'key' => 'value'\n]"
            }
            className="font-mono min-h-[650px] bg-background/50 backdrop-blur"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-foreground">
              {mode === 'json-to-php' ? 'PHP Array Output' : 'JSON Output'}
            </label>
            <CopyButton value={output} size="sm" />
          </div>
          <OutputDisplay value={error || output} className="min-h-[650px]" multiline={true} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
