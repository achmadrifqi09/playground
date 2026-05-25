'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { decodeJwt, extractJwt, verifySignature, JwtParts } from '@/lib/utils/jwt';
import { AlertCircle, CheckCircle, ShieldAlert, Sparkles, Shield, Clock, HelpCircle, Activity } from 'lucide-react';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';

interface SecurityWarning {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
}

interface JwtDecoderClientProps {
  infoSection?: React.ReactNode;
}

export default function JwtDecoderClient({ infoSection }: JwtDecoderClientProps) {
  const [mounted, setMounted] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [extractedToken, setExtractedToken] = useState('');
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [secret, setSecret] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<{ isValid: boolean | null; message: string }>({
    isValid: null,
    message: 'Enter a secret or public key to verify signature',
  });
  const [extractionSource, setExtractionSource] = useState<'direct' | 'bearer' | 'curl' | 'json' | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedInput = localStorage.getItem('jwt_decoder_input');
      const savedSecret = localStorage.getItem('jwt_decoder_secret');
      if (savedInput) setRawInput(savedInput);
      if (savedSecret) setSecret(savedSecret);
    }
  }, []);

  const handleProcessInput = useCallback((input: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_decoder_input', input);
    }

    if (!input.trim()) {
      setExtractedToken('');
      setDecoded(null);
      setExtractionSource(null);
      setVerifyStatus({ isValid: null, message: 'Enter a secret or public key to verify signature' });
      return;
    }

    let source: 'direct' | 'bearer' | 'curl' | 'json' | 'direct' = 'direct';
    if (input.includes('curl')) source = 'curl';
    else if (input.trim().startsWith('{')) source = 'json';
    else if (input.toLowerCase().includes('bearer')) source = 'bearer';

    const token = extractJwt(input);
    if (token) {
      setExtractedToken(token);
      setExtractionSource(source);
      const decodedResult = decodeJwt(token);
      setDecoded(decodedResult);
    } else {
      setExtractedToken('');
      setDecoded(null);
      setExtractionSource(null);
    }
  }, []);

  useEffect(() => {
    handleProcessInput(rawInput);
  }, [rawInput, handleProcessInput]);

  const handleVerify = async () => {
    if (!extractedToken || !decoded) return;
    const algo = typeof decoded.header.alg === 'string' ? decoded.header.alg : 'HS256';
    
    if (algo.toUpperCase() === 'NONE') {
      setVerifyStatus({
        isValid: false,
        message: 'Cannot verify signature when algorithm is "none"',
      });
      return;
    }

    setVerifyStatus({ isValid: null, message: 'Verifying...' });
    const result = await verifySignature(extractedToken, secret, algo);
    setVerifyStatus(result);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_decoder_secret', secret);
    }
    if (extractedToken && decoded && secret) {
      handleVerify();
    } else if (!secret) {
      setVerifyStatus({ isValid: null, message: 'Enter a secret or public key to verify signature' });
    }
  }, [secret, extractedToken, decoded]);

  const getExpirationDetails = () => {
    if (!decoded || !decoded.payload) return null;
    const payload = decoded.payload;
    const now = Math.floor(Date.now() / 1000);

    const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
    const iat = typeof payload.iat === 'number' ? payload.iat : undefined;
    const nbf = typeof payload.nbf === 'number' ? payload.nbf : undefined;

    let status: 'valid' | 'expired' | 'not-active-yet' = 'valid';
    let remainingTime = 0;
    let totalLifetime = 0;
    let progress = 0;

    if (exp) {
      remainingTime = exp - now;
      if (remainingTime < 0) {
        status = 'expired';
      }
    }

    if (nbf && now < nbf) {
      status = 'not-active-yet';
    }

    if (iat && exp) {
      totalLifetime = exp - iat;
      const elapsed = now - iat;
      progress = Math.min(100, Math.max(0, (elapsed / totalLifetime) * 100));
    }

    return {
      exp,
      iat,
      nbf,
      status,
      remainingTime,
      totalLifetime,
      progress,
    };
  };

  const expDetails = getExpirationDetails();

  const getSecurityWarnings = (): SecurityWarning[] => {
    const warnings: SecurityWarning[] = [];
    if (!decoded) return [];

    const header = decoded.header;
    const payload = decoded.payload;

    const alg = typeof header.alg === 'string' ? header.alg : '';
    const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
    const iat = typeof payload.iat === 'number' ? payload.iat : undefined;

    if (!alg) {
      warnings.push({
        id: 'no-algo',
        type: 'critical',
        title: 'Missing Algorithm',
        description: 'The JWT does not specify a signature algorithm in its header.',
      });
    } else if (alg.toLowerCase() === 'none') {
      warnings.push({
        id: 'algo-none',
        type: 'critical',
        title: 'None Algorithm Enabled',
        description: 'Using the "none" algorithm allows bypass of signature verification. This is a severe vulnerability.',
      });
    } else if (alg.toLowerCase() === 'hs256' && secret === '') {
      warnings.push({
        id: 'empty-secret',
        type: 'warning',
        title: 'Empty HS256 Secret',
        description: 'A secret key must be supplied to verify standard HS256 signatures.',
      });
    }

    if (!exp) {
      warnings.push({
        id: 'no-exp',
        type: 'warning',
        title: 'Missing Expiration (exp) Claim',
        description: 'This token has no expiration. It will remain valid forever unless manually revoked, exposing it to replay attacks.',
      });
    } else {
      const now = Math.floor(Date.now() / 1000);
      const lifetime = exp - (iat || now);
      if (lifetime > 30 * 24 * 60 * 60) {
        warnings.push({
          id: 'long-lifetime',
          type: 'info',
          title: 'Excessive Token Lifetime',
          description: `Token has a lifespan of ${(lifetime / (24 * 60 * 60)).toFixed(1)} days. Recommended lifespan for access tokens is under 1 hour.`,
        });
      }

      if (exp < now) {
        warnings.push({
          id: 'token-expired',
          type: 'critical',
          title: 'Token Expired',
          description: `This token expired on ${new Date(exp * 1000).toLocaleString()}.`,
        });
      }
    }

    const payloadSize = new TextEncoder().encode(JSON.stringify(payload)).length;
    if (payloadSize > 4096) {
      warnings.push({
        id: 'large-payload',
        type: 'warning',
        title: 'Oversized Payload',
        description: `Payload is ${payloadSize} bytes. JWTs are sent with every HTTP request; payloads over 4KB can degrade network performance.`,
      });
    }

    const suspiciousKeys = ['admin', 'role', 'roles', 'permissions', 'scope'];
    suspiciousKeys.forEach(key => {
      const val = payload[key];
      if (val !== undefined) {
        warnings.push({
          id: `claim-${key}`,
          type: 'info',
          title: `Privileged Claim Detected: "${key}"`,
          description: `The token contains user capabilities or privilege claim: "${key}". Ensure client-side logic doesn't solely rely on this without backend verification.`,
        });
      }
    });

    return warnings;
  };

  const warnings = getSecurityWarnings();

  const formatTimestamp = (ts?: number) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString();
  };

  const getRelativeTime = (seconds: number) => {
    const abs = Math.abs(seconds);
    const mins = Math.floor(abs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let unit = '';
    let val = 0;

    if (days > 0) {
      val = days;
      unit = days === 1 ? 'day' : 'days';
    } else if (hours > 0) {
      val = hours;
      unit = hours === 1 ? 'hour' : 'hours';
    } else if (mins > 0) {
      val = mins;
      unit = mins === 1 ? 'minute' : 'minutes';
    } else {
      val = abs;
      unit = abs === 1 ? 'second' : 'seconds';
    }

    return seconds < 0 ? `${val} ${unit} ago` : `in ${val} ${unit}`;
  };

  return (
    <ToolPageLayout
      title="JWT Decoder & Inspector"
      description="Decode, inspect, and verify JSON Web Tokens (JWT) locally. All operations happen inside your browser."
      category="security"
      keywords={['jwt decoder', 'jwt inspector', 'decode jwt online', 'verify jwt']}
      maxWidth="max-w-7xl"
      infoSection={infoSection}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Raw Input
              </label>
              {extractionSource && extractionSource !== 'direct' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Smart Extracted from {extractionSource}
                </span>
              )}
            </div>
            <Textarea
              value={rawInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRawInput(e.target.value)}
              placeholder="Paste raw JWT, Authorization: Bearer token, JSON response, or cURL request here..."
              className="font-mono min-h-[220px] bg-background/50 backdrop-blur text-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-300"
            />
          </div>

          <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg text-[10px] uppercase font-bold text-primary tracking-wider">
              Signature
            </div>
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verify Signature
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Secret (HS256) or Public Key in PEM format (RS256)
                </label>
                <Textarea
                  value={secret}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSecret(e.target.value)}
                  placeholder="Enter secret for HMAC verification or RSA public key..."
                  className="font-mono text-xs min-h-[90px] bg-background/60"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className={`text-xs font-medium flex items-center gap-1.5 ${
                  verifyStatus.isValid === true ? 'text-green-500' : 
                  verifyStatus.isValid === false ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {verifyStatus.isValid === true && <CheckCircle className="h-4 w-4" />}
                  {verifyStatus.isValid === false && <AlertCircle className="h-4 w-4" />}
                  {verifyStatus.isValid === null && <HelpCircle className="h-4 w-4" />}
                  {verifyStatus.message}
                </span>
                
                <Button 
                  onClick={handleVerify} 
                  disabled={!mounted || !extractedToken || !secret} 
                  size="sm"
                  className="bg-primary hover:bg-primary/95"
                >
                  Verify Now
                </Button>
              </div>
            </div>
          </div>

          {decoded && expDetails && (
            <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Lifespan & Expiration Analysis
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-semibold uppercase px-2 py-0.5 rounded text-[10px] ${
                    expDetails.status === 'valid' ? 'bg-green-500/20 text-green-500' :
                    expDetails.status === 'expired' ? 'bg-destructive/20 text-destructive' :
                    'bg-amber-500/20 text-amber-500'
                  }`}>
                    {expDetails.status}
                  </span>
                </div>

                {expDetails.exp && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-mono text-foreground font-medium">
                      {formatTimestamp(expDetails.exp)} ({getRelativeTime(expDetails.remainingTime)})
                    </span>
                  </div>
                )}

                {expDetails.iat && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Issued At:</span>
                    <span className="font-mono text-foreground">{formatTimestamp(expDetails.iat)}</span>
                  </div>
                )}

                {expDetails.exp && expDetails.iat && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>IAT ({new Date(expDetails.iat * 1000).toLocaleTimeString()})</span>
                      <span>EXP ({new Date(expDetails.exp * 1000).toLocaleTimeString()})</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative border border-border">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          expDetails.status === 'expired' ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-violet-500'
                        }`}
                        style={{ width: `${expDetails.progress}%` }}
                      />
                    </div>
                    <div className="text-center text-[10px] text-muted-foreground font-medium">
                      {expDetails.status === 'expired' 
                        ? 'Token has fully expired' 
                        : `${expDetails.progress.toFixed(1)}% of token lifecycle elapsed`
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!decoded ? (
            <div className="h-full min-h-[400px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center bg-card/10">
              <ShieldAlert className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="font-bold text-foreground mb-1">No Valid JWT Detected</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Paste a token on the left. The tool will automatically parse headers, payloads, and evaluate claims in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Header: Algorithm & Metadata
                  </h3>
                  <CopyButton value={JSON.stringify(decoded.header, null, 2)} size="sm" />
                </div>
                <OutputDisplay
                  value={JSON.stringify(decoded.header, null, 2)}
                  multiline={true}
                  className="font-mono text-xs min-h-[100px] bg-background/60"
                />
              </div>

              <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Payload: Data & Claims
                  </h3>
                  <CopyButton value={JSON.stringify(decoded.payload, null, 2)} size="sm" />
                </div>
                <OutputDisplay
                  value={JSON.stringify(decoded.payload, null, 2)}
                  multiline={true}
                  className="font-mono text-xs min-h-[250px] bg-background/60"
                />
              </div>

              <div className="border border-border rounded-xl p-5 bg-card/40 backdrop-blur">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Security Analysis & Claim Auditing
                </h3>

                {warnings.length === 0 ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg border border-green-500/20 bg-green-500/5 text-green-500 text-xs">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>No security warnings found for this token configuration! Perfect structure.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {warnings.map(warning => (
                      <div 
                        key={warning.id}
                        className={`flex gap-3 p-3.5 rounded-lg border text-xs leading-relaxed ${
                          warning.type === 'critical' ? 'border-destructive/30 bg-destructive/5 text-destructive' :
                          warning.type === 'warning' ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' :
                          'border-blue-500/30 bg-blue-500/5 text-blue-400'
                        }`}
                      >
                        <ShieldAlert className="h-5 w-5 shrink-0" />
                        <div>
                          <div className="font-bold mb-0.5">{warning.title}</div>
                          <div className="opacity-90">{warning.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
