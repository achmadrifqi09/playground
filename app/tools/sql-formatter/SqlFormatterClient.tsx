'use client';

import React, { useState, useEffect } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSql, minifySql, analyzeSqlQuery, SqlAnalysis } from '@/lib/utils/sql';
import { ShieldAlert, AlertTriangle, Layers, Database, FileText, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';

interface SqlFormatterClientProps {
  infoSection?: React.ReactNode;
}

export default function SqlFormatterClient({ infoSection }: SqlFormatterClientProps) {
  const [dialect, setDialect] = useState('mysql');
  const [input, setInput] = useState("SELECT u.id, u.name, o.total, o.created_at FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.total > 100 AND u.status = 'active'");
  const [output, setOutput] = useState('');
  const [analysis, setAnalysis] = useState<SqlAnalysis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInput = localStorage.getItem('sql_formatter_input');
      const savedDialect = localStorage.getItem('sql_formatter_dialect');
      if (savedInput) setInput(savedInput);
      if (savedDialect) setDialect(savedDialect);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sql_formatter_input', input);
      localStorage.setItem('sql_formatter_dialect', dialect);
    }

    if (!input.trim()) {
      setOutput('');
      setAnalysis(null);
      return;
    }

    const formatted = formatSql(input, dialect);
    setOutput(formatted);

    const result = analyzeSqlQuery(input);
    setAnalysis(result);
  }, [input, dialect]);

  const handleFormat = () => {
    const formatted = formatSql(input, dialect);
    setOutput(formatted);
  };

  const handleMinify = () => {
    const minified = minifySql(input);
    setOutput(minified);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500 bg-green-500/10';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-500/10';
    return 'text-destructive border-destructive bg-destructive/10';
  };

  return (
    <ToolPageLayout
      title="SQL Formatter & Query Analyzer"
      description="Format, minify, and analyze your SQL queries. Audit performance, dangerous patterns, and query structures locally."
      category="utility"
      keywords={['sql formatter', 'sql query analyzer', 'beautify sql', 'minify sql']}
      maxWidth="max-w-7xl"
      infoSection={infoSection}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                SQL Query Input
              </label>

              <select
                value={dialect}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDialect(e.target.value)}
                className="bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
              >
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="sqlserver">SQL Server</option>
              </select>
            </div>

            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder="Paste raw, unformatted SQL query here..."
              className="font-mono min-h-[350px] bg-background/50 text-sm hover:border-primary/50 focus:border-primary transition-all duration-300"
            />

            <div className="flex gap-2">
              <Button onClick={handleFormat} className="flex-1 bg-primary hover:bg-primary/95 flex gap-2">
                <Zap className="h-4 w-4" /> Formatter
              </Button>
              <Button variant="outline" onClick={handleMinify} className="flex-1 flex gap-2">
                <Layers className="h-4 w-4" /> Minify
              </Button>
            </div>
          </div>

          {analysis && (
            <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Readability & Complexity Index
              </h3>

              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center font-bold text-lg ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}
                  <span className="text-[8px] uppercase tracking-wider -mt-1 opacity-70">score</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-foreground">
                    {analysis.readabilityScore >= 80 ? 'Highly Readable Query' :
                     analysis.readabilityScore >= 50 ? 'Moderately Complex Query' : 'Highly Complex / Hard to Read'}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-normal">
                    Calculated from the depth of nesting, join frequencies, selected column targets, and overall query size.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-border/40">
                <div className="space-y-1 p-2 rounded-lg bg-background/30 border border-border/20">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Select count</span>
                  <span className="font-mono font-bold text-foreground">{analysis.complexityInfo.selectCount}</span>
                </div>
                <div className="space-y-1 p-2 rounded-lg bg-background/30 border border-border/20">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Join count</span>
                  <span className="font-mono font-bold text-foreground">{analysis.complexityInfo.joinCount}</span>
                </div>
                <div className="space-y-1 p-2 rounded-lg bg-background/30 border border-border/20">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Nesting depth</span>
                  <span className="font-mono font-bold text-foreground">{analysis.complexityInfo.nestingDepth} levels</span>
                </div>
                <div className="space-y-1 p-2 rounded-lg bg-background/30 border border-border/20">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">WHERE clauses</span>
                  <span className="font-mono font-bold text-foreground">{analysis.complexityInfo.whereConditionsCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!analysis ? (
            <div className="h-full min-h-[400px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center bg-card/10">
              <FileText className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="font-bold text-foreground mb-1">Waiting for Query</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Paste your SQL query on the left. The formatter will automatically clean the query and inspect performance/security.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="output" className="w-full">
              <TabsList className="bg-muted/30 border border-border w-full justify-start p-1 rounded-xl">
                <TabsTrigger value="output" className="rounded-lg text-xs">Formatted Output</TabsTrigger>
                <TabsTrigger value="diagnostics" className="rounded-lg text-xs">
                  Diagnostics ({analysis.dangerousQueries.length + analysis.warnings.length})
                </TabsTrigger>
                <TabsTrigger value="visualizer" className="rounded-lg text-xs">Query Visualizer</TabsTrigger>
              </TabsList>

              <TabsContent value="output" className="pt-4 space-y-4">
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10 flex gap-2">
                    <CopyButton value={output} size="sm" />
                  </div>
                  <OutputDisplay
                    value={output}
                    multiline={true}
                    className="font-mono text-xs min-h-[450px] bg-background/50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="diagnostics" className="pt-4 space-y-4">
                {analysis.dangerousQueries.length === 0 && analysis.warnings.length === 0 ? (
                  <div className="flex items-center gap-2.5 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-500 text-xs">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>Fantastic! No dangerous queries or anti-patterns detected in this statement.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysis.dangerousQueries.map((dq, idx) => (
                      <div key={idx} className="flex gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs leading-relaxed">
                        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold mb-1">{dq.title}</div>
                          <div className="opacity-90">{dq.desc}</div>
                        </div>
                      </div>
                    ))}

                    {analysis.warnings.map((w, idx) => (
                      <div key={idx} className="flex gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-500 text-xs leading-relaxed">
                        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold mb-1">{w.title}</div>
                          <div className="opacity-90">{w.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="visualizer" className="pt-4 space-y-4">
                <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">1. Select Output Target</span>
                    <div className="flex flex-wrap gap-2 p-3 bg-background/50 border border-border/40 rounded-lg">
                      {analysis.structure.columns.map((c, i) => (
                        <span key={i} className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-foreground border border-border/30">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {analysis.structure.tables.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">2. Primary Source Tables</span>
                      <div className="flex flex-wrap gap-2 p-3 bg-background/50 border border-border/40 rounded-lg">
                        {analysis.structure.tables.map((t, i) => (
                          <span key={i} className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.structure.joins.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">3. Joined Connections</span>
                      <div className="space-y-2">
                        {analysis.structure.joins.map((j, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-background/50 border border-border/40 rounded-lg text-xs">
                            <span className="font-bold text-violet-400 uppercase font-mono px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 shrink-0 w-max">
                              {j.type}
                            </span>
                            <ChevronRight className="hidden sm:inline h-4 w-4 text-muted-foreground" />
                            <span className="font-mono font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/20">
                              {j.table}
                            </span>
                            <span className="text-muted-foreground">ON</span>
                            <span className="font-mono text-foreground">{j.on}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.structure.where.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">4. Filtering Constraints (WHERE)</span>
                      <div className="flex flex-col gap-2 p-3 bg-background/50 border border-border/40 rounded-lg">
                        {analysis.structure.where.map((w, i) => (
                          <div key={i} className="font-mono text-xs text-foreground bg-muted/30 px-2.5 py-1 rounded border border-border/20">
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
