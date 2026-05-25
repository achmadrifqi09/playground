import JwtDecoderClient from './JwtDecoderClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { jwtDecoderMetadata } from '@/constants/metadata';
export const metadata = jwtDecoderMetadata;

const jwtInfoSection = (
  <ToolInfoSection
    introduction="A JWT (JSON Web Token) is a compact, URL-safe token format defined by RFC 7519 that is widely used for authentication and secure information exchange between parties. This tool lets you decode and inspect any JWT instantly, right inside your browser — no server involved, no data ever transmitted."
    steps={[
      {
        step: 1,
        title: 'Paste your JWT token',
        description:
          'Paste a raw JWT, an Authorization: Bearer header, a JSON response body, or an entire cURL command. The tool automatically extracts the token.',
      },
      {
        step: 2,
        title: 'Inspect the decoded payload',
        description:
          'The header, payload, and all claims are decoded and displayed instantly. You can view the algorithm, expiration (exp), issued-at (iat), and any custom claims.',
      },
      {
        step: 3,
        title: 'Verify the signature (optional)',
        description:
          'Enter your HMAC secret or RSA public key in PEM format to cryptographically verify the token signature and confirm it has not been tampered with.',
      },
      {
        step: 4,
        title: 'Review the security analysis',
        description:
          'The tool automatically flags security issues such as missing expiration, excessive token lifetime, the "none" algorithm, or privileged role claims.',
      },
    ]}
    features={[
      {
        title: 'Smart Token Extraction',
        description:
          'Automatically extracts JWT from raw tokens, Bearer headers, JSON payloads, and cURL commands.',
      },
      {
        title: 'Header & Payload Decoding',
        description:
          'Decodes and pretty-prints the JWT header (algorithm, type) and payload (claims) with full JSON formatting.',
      },
      {
        title: 'Signature Verification',
        description:
          'Supports HS256 HMAC secret verification and RS256/ES256 RSA public key verification in PEM format.',
      },
      {
        title: 'Expiration Timeline',
        description:
          'Visualizes the token lifecycle from issued-at (iat) to expiration (exp) with a progress bar and relative time display.',
      },
      {
        title: 'Security Audit',
        description:
          'Detects common JWT vulnerabilities: missing exp claim, "none" algorithm, oversized payload, and privilege escalation claims.',
      },
      {
        title: '100% Client-Side & Secure',
        description:
          'All decoding and verification happens locally in your browser. Your JWT tokens are never sent to any server.',
      },
    ]}
    faqs={[
      {
        question: 'Is it safe to paste my JWT token here?',
        answer:
          'Yes. This tool is 100% client-side. Your JWT token is decoded entirely within your browser using JavaScript — no data is ever sent to a server or stored remotely.',
      },
      {
        question: 'What is a JWT and how does it work?',
        answer:
          'A JSON Web Token (JWT) consists of three base64url-encoded parts separated by dots: a header (algorithm and token type), a payload (claims/data), and a signature. The signature is created by the issuer using a secret or private key and can be verified by the recipient.',
      },
      {
        question: 'Can this tool verify the JWT signature?',
        answer:
          'Yes. Enter your HMAC secret (for HS256) or RSA public key in PEM format (for RS256/ES256) to cryptographically verify the signature and confirm the token has not been tampered with.',
      },
      {
        question: 'What JWT algorithms are supported?',
        answer:
          'This tool supports decoding any JWT regardless of algorithm. Signature verification supports HS256 (HMAC-SHA256), RS256 (RSA-SHA256), and ES256 (ECDSA-SHA256).',
      },
      {
        question: 'Why does my JWT have no expiration warning?',
        answer:
          'JWTs without an "exp" claim never expire, which is a security risk. The tool flags this as a warning to encourage you to always set an expiration time on your tokens.',
      },
    ]}
  />
);

export default function Page() {
  return <JwtDecoderClient infoSection={jwtInfoSection} />;
}
