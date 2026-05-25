'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  parseCurlCommand,
  generateCurlCommand,
  generateFetchCode,
  generateNodeCode,
} from '@/lib/utils/curl';
import { Play, Plus, Trash2, Settings, CheckCircle2, XCircle, Pin, RefreshCw } from 'lucide-react';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';

interface KeyValuePair {
  key: string;
  value: string;
}

interface AuthConfig {
  token: string;
  username: string;
  password: string;
  apiKeyName: string;
  apiKeyValue: string;
}

interface SavedRequest {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  authType: string;
  authConfig: AuthConfig;
  isPinned?: boolean;
}

interface CurlBuilderClientProps {
  infoSection?: React.ReactNode;
}

export default function CurlBuilderClient({ infoSection }: CurlBuilderClientProps) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);
  const [params, setParams] = useState<KeyValuePair[]>([]);
  const [body, setBody] = useState('');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'apikey'>('none');
  const [authConfig, setAuthConfig] = useState({
    token: '',
    username: '',
    password: '',
    apiKeyName: 'X-API-Key',
    apiKeyValue: '',
  });

  const [variables, setVariables] = useState<KeyValuePair[]>([
    { key: 'BASE_URL', value: 'https://jsonplaceholder.typicode.com' },
    { key: 'API_KEY', value: 'super-secret-key-123' },
  ]);

  const [assertions, setAssertions] = useState([
    { id: '1', type: 'status', expected: '200' },
    { id: '2', type: 'json_field', key: 'id', expected: '1' },
  ]);

  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    time: number;
    size: number;
    headers: [string, string][];
    body: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [importArea, setImportArea] = useState('');
  const [activeTab, setActiveTab] = useState('params');
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [chainingVariable, setChainingVariable] = useState({ key: 'TOKEN', jsonPath: 'id' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInput = localStorage.getItem('curl_builder_url');
      const savedMethod = localStorage.getItem('curl_builder_method');
      const savedVariables = localStorage.getItem('curl_builder_variables');
      const savedReqs = localStorage.getItem('curl_builder_saved_requests');
      const savedBody = localStorage.getItem('curl_builder_body');

      if (savedInput) setUrl(savedInput);
      if (savedMethod) setMethod(savedMethod);
      if (savedVariables) setVariables(JSON.parse(savedVariables));
      if (savedReqs) setSavedRequests(JSON.parse(savedReqs));
      if (savedBody) setBody(savedBody);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('curl_builder_url', url);
      localStorage.setItem('curl_builder_method', method);
      localStorage.setItem('curl_builder_variables', JSON.stringify(variables));
      localStorage.setItem('curl_builder_body', body);
    }
  }, [url, method, variables, body]);

  const resolveVariables = (str: string): string => {
    let resolved = str;
    variables.forEach(v => {
      if (v.key) {
        resolved = resolved.replace(new RegExp(`{{\\s*${v.key}\\s*}}`, 'g'), v.value);
      }
    });
    return resolved;
  };

  const handleSend = async () => {
    setLoading(true);
    const resolvedUrl = resolveVariables(url);
    const start = performance.now();

    const requestHeaders: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key && h.value) {
        requestHeaders[h.key] = resolveVariables(h.value);
      }
    });

    if (authType === 'bearer' && authConfig.token) {
      requestHeaders['Authorization'] = `Bearer ${resolveVariables(authConfig.token)}`;
    } else if (authType === 'basic' && (authConfig.username || authConfig.password)) {
      const creds = btoa(`${authConfig.username}:${authConfig.password}`);
      requestHeaders['Authorization'] = `Basic ${creds}`;
    } else if (authType === 'apikey' && authConfig.apiKeyName && authConfig.apiKeyValue) {
      requestHeaders[authConfig.apiKeyName] = resolveVariables(authConfig.apiKeyValue);
    }

    const urlObj = new URL(resolvedUrl);
    params.forEach(p => {
      if (p.key) {
        urlObj.searchParams.set(p.key, resolveVariables(p.value));
      }
    });

    try {
      const response = await fetch(urlObj.toString(), {
        method,
        headers: requestHeaders,
        body:
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body
            ? resolveVariables(body)
            : undefined,
      });

      const end = performance.now();
      const bodyText = await response.text();
      const sizeBytes = new TextEncoder().encode(bodyText).length;

      const headerPairs: [string, string][] = [];
      response.headers.forEach((val, key) => {
        headerPairs.push([key, val]);
      });

      const resData = {
        status: response.status,
        statusText: response.statusText,
        time: Math.round(end - start),
        size: sizeBytes,
        headers: headerPairs,
        body: bodyText,
      };

      setResponse(resData);

      if (chainingVariable.key && chainingVariable.jsonPath) {
        try {
          const parsedJson = JSON.parse(bodyText);
          const chainValue = parsedJson[chainingVariable.jsonPath];
          if (chainValue !== undefined) {
            setVariables(prev => {
              const updated = prev.map(v =>
                v.key === chainingVariable.key ? { ...v, value: String(chainValue) } : v
              );
              if (!updated.some(v => v.key === chainingVariable.key)) {
                updated.push({ key: chainingVariable.key, value: String(chainValue) });
              }
              return updated;
            });
          }
        } catch (e) {}
      }

      saveToRecentHistory();
    } catch (e: unknown) {
      const err = e as Error;
      setResponse({
        status: 0,
        statusText: 'Error',
        time: 0,
        size: 0,
        headers: [],
        body: `Request failed: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToRecentHistory = () => {
    const newReq: SavedRequest = {
      id: Math.random().toString(),
      name: `${method} ${url.replace('https://', '').slice(0, 30)}`,
      url,
      method,
      headers,
      params,
      body,
      authType,
      authConfig,
    };

    setSavedRequests(prev => {
      const updated = [newReq, ...prev.slice(0, 19)];
      if (typeof window !== 'undefined') {
        localStorage.setItem('curl_builder_saved_requests', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleImportCurl = () => {
    if (!importArea.trim()) return;
    const parsed = parseCurlCommand(importArea);
    if (parsed.url) {
      setUrl(parsed.url);
      setMethod(parsed.method);
      if (parsed.headers.length > 0) {
        setHeaders(parsed.headers);
      }
      if (parsed.body) {
        setBody(parsed.body);
      }
      setImportArea('');
    }
  };

  const getValidationResults = () => {
    if (!response) return [];
    return assertions.map(a => {
      let isPassed = false;
      let actualValue = '';

      if (a.type === 'status') {
        actualValue = String(response.status);
        isPassed = actualValue === a.expected;
      } else if (a.type === 'json_field') {
        try {
          const parsed = JSON.parse(response.body);
          if (a.key) {
            actualValue = String(parsed[a.key]);
            isPassed = actualValue === a.expected;
          }
        } catch (e) {
          actualValue = 'Invalid JSON';
        }
      }

      return {
        ...a,
        isPassed,
        actualValue,
      };
    });
  };

  const testResults = getValidationResults();

  const handleTogglePin = (id: string) => {
    setSavedRequests(prev => {
      const updated = prev.map(r => (r.id === id ? { ...r, isPinned: !r.isPinned } : r));
      if (typeof window !== 'undefined') {
        localStorage.setItem('curl_builder_saved_requests', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleLoadRequest = (req: SavedRequest) => {
    setUrl(req.url);
    setMethod(req.method);
    setHeaders(req.headers || []);
    setParams(req.params || []);
    setBody(req.body || '');
    setAuthType((req.authType as 'none' | 'bearer' | 'basic' | 'apikey') || 'none');
    setAuthConfig(
      req.authConfig || {
        token: '',
        username: '',
        password: '',
        apiKeyName: 'X-API-Key',
        apiKeyValue: '',
      }
    );
  };

  return (
    <ToolPageLayout
      title="cURL Builder & API Playground"
      description="Build and test HTTP API endpoints. Import cURL, resolve custom local variables, and auto-chain requests."
      category="utility"
      keywords={['curl builder', 'api playground', 'online postman', 'test api online']}
      maxWidth="max-w-7xl"
      infoSection={infoSection}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="border border-border rounded-xl p-4 bg-card/40 backdrop-blur">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Pin className="h-4 w-4 text-primary" />
              Pinned Requests
            </h3>
            <div className="space-y-2">
              {savedRequests.filter(r => r.isPinned).length === 0 ? (
                <div className="text-xs text-muted-foreground italic p-2">
                  No pinned requests. Pin any request from history below!
                </div>
              ) : (
                savedRequests
                  .filter(r => r.isPinned)
                  .map(req => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background border border-border/50 text-xs"
                    >
                      <button
                        onClick={() => handleLoadRequest(req)}
                        className="text-left font-mono truncate flex-1 hover:text-primary transition-colors"
                      >
                        <span className="font-bold text-primary mr-1">{req.method}</span>{' '}
                        {req.url.replace('https://', '')}
                      </button>
                      <button
                        onClick={() => handleTogglePin(req.id)}
                        className="text-primary hover:text-primary/70 ml-2"
                      >
                        <Pin className="h-3 w-3 fill-current" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="border border-border rounded-xl p-4 bg-card/40 backdrop-blur">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Request History
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {savedRequests.length === 0 ? (
                <div className="text-xs text-muted-foreground italic p-2">
                  No history. Send request to record.
                </div>
              ) : (
                savedRequests.map(req => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/30 hover:bg-background/50 border border-border/20 text-xs"
                  >
                    <button
                      onClick={() => handleLoadRequest(req)}
                      className="text-left font-mono truncate flex-1 hover:text-primary transition-colors"
                    >
                      <span className="font-bold text-muted-foreground mr-1">{req.method}</span>{' '}
                      {req.url.replace('https://', '')}
                    </button>
                    <button
                      onClick={() => handleTogglePin(req.id)}
                      className="text-muted-foreground hover:text-primary ml-2"
                    >
                      <Pin
                        className={`h-3 w-3 ${req.isPinned ? 'fill-current text-primary' : ''}`}
                      />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex gap-2 bg-card/40 border border-border p-3 rounded-xl backdrop-blur">
            <select
              value={method}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:border-primary"
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <Input
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter endpoint URL (e.g. {{BASE_URL}}/users)"
              className="flex-1 bg-background/50 border-border hover:border-primary/30 font-mono text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-primary hover:bg-primary/95 flex gap-2 px-6"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>

          <div className="border border-border/80 rounded-xl p-4 bg-card/40 flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Import from cURL Command
              </label>
              <Input
                value={importArea}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImportArea(e.target.value)}
                placeholder="Paste curl -X POST 'https://api.example.com' -H 'Authorization: ...'"
                className="font-mono text-xs bg-background/40"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleImportCurl}>
              Import
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/30 border border-border w-full justify-start p-1 rounded-xl">
              <TabsTrigger value="params" className="rounded-lg text-xs">
                Params
              </TabsTrigger>
              <TabsTrigger value="headers" className="rounded-lg text-xs">
                Headers
              </TabsTrigger>
              <TabsTrigger value="auth" className="rounded-lg text-xs">
                Auth
              </TabsTrigger>
              <TabsTrigger value="body" className="rounded-lg text-xs">
                Body
              </TabsTrigger>
              <TabsTrigger value="variables" className="rounded-lg text-xs">
                Variables
              </TabsTrigger>
              <TabsTrigger value="validation" className="rounded-lg text-xs">
                Tests & Validation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="params" className="pt-4 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  Query Parameters
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setParams(prev => [...prev, { key: '', value: '' }])}
                  className="gap-1.5 h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Param
                </Button>
              </div>
              {params.length === 0 ? (
                <div className="text-xs text-muted-foreground italic py-3 text-center border border-dashed border-border/50 rounded-lg">
                  No parameters. Added automatically or click above.
                </div>
              ) : (
                params.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Parameter Key"
                      value={p.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...params];
                        updated[idx].key = e.target.value;
                        setParams(updated);
                      }}
                      className="font-mono text-xs bg-background/40"
                    />
                    <span className="text-muted-foreground font-bold">=</span>
                    <Input
                      placeholder="Parameter Value"
                      value={p.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...params];
                        updated[idx].value = e.target.value;
                        setParams(updated);
                      }}
                      className="font-mono text-xs bg-background/40"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setParams(prev => prev.filter((_, i) => i !== idx))}
                      className="text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="headers" className="pt-4 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  HTTP Headers
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHeaders(prev => [...prev, { key: '', value: '' }])}
                  className="gap-1.5 h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Header
                </Button>
              </div>
              {headers.map((h, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder="Header Key"
                    value={h.key}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const updated = [...headers];
                      updated[idx].key = e.target.value;
                      setHeaders(updated);
                    }}
                    className="font-mono text-xs bg-background/40"
                  />
                  <span className="text-muted-foreground font-bold">:</span>
                  <Input
                    placeholder="Header Value"
                    value={h.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const updated = [...headers];
                      updated[idx].value = e.target.value;
                      setHeaders(updated);
                    }}
                    className="font-mono text-xs bg-background/40"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHeaders(prev => prev.filter((_, i) => i !== idx))}
                    className="text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent
              value="auth"
              className="pt-4 space-y-4 border border-border p-5 rounded-xl bg-card/10"
            >
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                  Auth Type
                </label>
                <select
                  value={authType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setAuthType(e.target.value as 'none' | 'bearer' | 'basic' | 'apikey')
                  }
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary w-full"
                >
                  <option value="none">No Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="apikey">API Key</option>
                </select>
              </div>

              {authType === 'bearer' && (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-medium text-foreground">Token</label>
                  <Input
                    value={authConfig.token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthConfig(prev => ({ ...prev, token: e.target.value }))
                    }
                    placeholder="Enter bearer token (supports variables like {{TOKEN}})"
                    className="font-mono text-xs"
                  />
                </div>
              )}

              {authType === 'basic' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Username</label>
                    <Input
                      value={authConfig.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAuthConfig(prev => ({ ...prev, username: e.target.value }))
                      }
                      placeholder="Username"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Password</label>
                    <Input
                      type="password"
                      value={authConfig.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAuthConfig(prev => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="Password"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {authType === 'apikey' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Header Key</label>
                    <Input
                      value={authConfig.apiKeyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAuthConfig(prev => ({ ...prev, apiKeyName: e.target.value }))
                      }
                      placeholder="X-API-Key"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Value</label>
                    <Input
                      value={authConfig.apiKeyValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAuthConfig(prev => ({ ...prev, apiKeyValue: e.target.value }))
                      }
                      placeholder="Key value..."
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="body" className="pt-4 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  Request Body (JSON / Raw)
                </span>
              </div>
              <Textarea
                value={body}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                placeholder="{\n  'key': 'value'\n}"
                className="font-mono text-xs min-h-[160px] bg-background/50"
              />
            </TabsContent>

            <TabsContent value="variables" className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Settings className="h-4 w-4 text-primary" /> Workspace Variables
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setVariables(prev => [...prev, { key: '', value: '' }])}
                  className="gap-1.5 h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Variable
                </Button>
              </div>

              <div className="space-y-2">
                {variables.map((v, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Variable Name (e.g. BASE_URL)"
                      value={v.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...variables];
                        updated[idx].key = e.target.value;
                        setVariables(updated);
                      }}
                      className="font-mono text-xs bg-background/40"
                    />
                    <span className="text-muted-foreground font-bold">=</span>
                    <Input
                      placeholder="Value"
                      value={v.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...variables];
                        updated[idx].value = e.target.value;
                        setVariables(updated);
                      }}
                      className="font-mono text-xs bg-background/40"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVariables(prev => prev.filter((_, i) => i !== idx))}
                      className="text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border border-border/50 rounded-xl p-4 mt-6 bg-muted/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Response Chaining (Auto Save to Variable)
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Save properties from response JSON body automatically into local variables.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground">
                      JSON Property Path
                    </label>
                    <Input
                      value={chainingVariable.jsonPath}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setChainingVariable(prev => ({ ...prev, jsonPath: e.target.value }))
                      }
                      placeholder="e.g. id, token, data.token"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground">
                      Save into Variable
                    </label>
                    <Input
                      value={chainingVariable.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setChainingVariable(prev => ({ ...prev, key: e.target.value }))
                      }
                      placeholder="e.g. TOKEN"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="pt-4 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  Response Validation assertions
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setAssertions(prev => [
                      ...prev,
                      { id: Math.random().toString(), type: 'json_field', key: '', expected: '' },
                    ])
                  }
                  className="gap-1.5 h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Assert
                </Button>
              </div>

              <div className="space-y-2">
                {assertions.map((a, idx) => (
                  <div key={a.id} className="flex gap-2 items-center">
                    <select
                      value={a.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const updated = [...assertions];
                        updated[idx].type = e.target.value;
                        setAssertions(updated);
                      }}
                      className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="status">HTTP Status Code</option>
                      <option value="json_field">JSON Field Value</option>
                    </select>

                    {a.type === 'json_field' && (
                      <Input
                        placeholder="Field (e.g. id)"
                        value={a.key || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updated = [...assertions];
                          updated[idx].key = e.target.value;
                          setAssertions(updated);
                        }}
                        className="font-mono text-xs w-[120px]"
                      />
                    )}

                    <span className="text-xs font-bold text-muted-foreground">must equal</span>

                    <Input
                      placeholder="Expected value"
                      value={a.expected}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...assertions];
                        updated[idx].expected = e.target.value;
                        setAssertions(updated);
                      }}
                      className="font-mono text-xs"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAssertions(prev => prev.filter(x => x.id !== a.id))}
                      className="text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-border">
            <div className="md:col-span-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Response Viewer
                </h3>
                {response && (
                  <div className="flex gap-3 text-xs font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        response.status >= 200 && response.status < 300
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-muted-foreground">{response.time} ms</span>
                    <span className="text-muted-foreground">
                      {(response.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>

              {!response ? (
                <div className="h-[300px] border border-dashed border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground bg-card/40">
                  Send a request to see the HTTP response body, headers, timing, and test validation
                </div>
              ) : (
                <Tabs defaultValue="body" className="w-full">
                  <TabsList className="bg-muted/10 border border-border/50 p-1 w-full justify-start rounded-lg h-auto">
                    <TabsTrigger value="body" className="text-xs py-1">
                      Response Body
                    </TabsTrigger>
                    <TabsTrigger value="headers" className="text-xs py-1">
                      Headers ({response.headers.length})
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="text-xs py-1">
                      Tests ({testResults.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="body" className="pt-2">
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-10 flex gap-2">
                        <CopyButton value={response.body} size="sm" />
                      </div>
                      <OutputDisplay
                        value={response.body}
                        multiline={true}
                        className="font-mono text-xs min-h-[300px] bg-background/50"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="headers"
                    className="pt-2 max-h-[300px] overflow-y-auto border border-border rounded-lg bg-card/20 p-2"
                  >
                    <table className="w-full text-xs font-mono">
                      <tbody>
                        {response.headers.map(([k, v]) => (
                          <tr key={k} className="border-b border-border/30">
                            <td className="font-bold p-1.5 text-primary break-all">{k}</td>
                            <td className="p-1.5 break-all text-foreground">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TabsContent>

                  <TabsContent value="tests" className="pt-2 space-y-2">
                    {testResults.length === 0 ? (
                      <div className="text-xs text-muted-foreground italic p-2">
                        No tests configured. Create response assertions under the Tests tab above.
                      </div>
                    ) : (
                      testResults.map(tr => (
                        <div
                          key={tr.id}
                          className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                            tr.isPassed
                              ? 'border-green-500/20 bg-green-500/5 text-green-500'
                              : 'border-destructive/20 bg-destructive/5 text-destructive'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {tr.isPassed ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0" />
                            )}
                            <span>
                              {tr.type === 'status'
                                ? `HTTP Status assertion: Expected equal "${tr.expected}"`
                                : `JSON Field "${tr.key}" assertion: Expected "${tr.expected}"`}
                            </span>
                          </div>
                          <span className="font-mono text-[10px]">Actual: "{tr.actualValue}"</span>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="md:col-span-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Integration Code
              </h3>
              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="bg-muted/10 border border-border/50 p-1 w-full justify-start rounded-lg h-auto">
                  <TabsTrigger value="curl" className="text-[10px] py-1">
                    cURL
                  </TabsTrigger>
                  <TabsTrigger value="fetch" className="text-[10px] py-1">
                    Fetch JS
                  </TabsTrigger>
                  <TabsTrigger value="node" className="text-[10px] py-1">
                    Axios Node
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="curl" className="pt-2">
                  <OutputDisplay
                    value={generateCurlCommand(url, method, headers, body)}
                    multiline={true}
                    className="font-mono text-[10px] min-h-[220px]"
                  />
                </TabsContent>

                <TabsContent value="fetch" className="pt-2">
                  <OutputDisplay
                    value={generateFetchCode(url, method, headers, body)}
                    multiline={true}
                    className="font-mono text-[10px] min-h-[220px]"
                  />
                </TabsContent>

                <TabsContent value="node" className="pt-2">
                  <OutputDisplay
                    value={generateNodeCode(url, method, headers, body)}
                    multiline={true}
                    className="font-mono text-[10px] min-h-[220px]"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
