import CurlBuilderClient from './CurlBuilderClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { curlBuilderMetadata } from '@/constants/metadata';
export const metadata = curlBuilderMetadata;

const curlInfoSection = (
  <ToolInfoSection
    introduction="cURL is the de facto standard for making HTTP requests from the command line. This tool brings the power of cURL into your browser — build requests with a visual interface, import existing cURL commands, set headers and query parameters, authenticate with Bearer tokens, Basic Auth, or API keys, and inspect response data, status codes, and headers in real time."
    steps={[
      {
        step: 1,
        title: 'Enter the request URL and method',
        description:
          'Type your API endpoint URL in the input field and select the HTTP method (GET, POST, PUT, DELETE, etc.) from the dropdown.',
      },
      {
        step: 2,
        title: 'Configure headers, params, and auth',
        description:
          'Use the tabs to add query parameters, custom HTTP headers, and authentication credentials (Bearer, Basic, or API key).',
      },
      {
        step: 3,
        title: 'Add a request body (optional)',
        description:
          'For POST, PUT, or PATCH requests, paste your JSON or raw request body in the Body tab.',
      },
      {
        step: 4,
        title: 'Click Send and inspect the response',
        description:
          'Send the request and view the response status, body, headers, and response time. The request is saved to history automatically.',
      },
      {
        step: 5,
        title: 'Import from cURL (optional)',
        description:
          'Paste any existing cURL command into the import field. The tool automatically parses the URL, method, headers, and body.',
      },
    ]}
    features={[
      {
        title: 'Visual HTTP Request Builder',
        description: 'Build HTTP requests with a clean UI — no command line required.',
      },
      {
        title: 'cURL Import',
        description:
          'Paste any cURL command to auto-populate the URL, method, headers, and request body.',
      },
      {
        title: 'Multiple Auth Methods',
        description:
          'Supports Bearer token, Basic Auth (username/password), and API Key authentication.',
      },
      {
        title: 'Workspace Variables',
        description:
          'Define reusable variables like {{BASE_URL}} and {{API_KEY}} to avoid repeating values across requests.',
      },
      {
        title: 'Request History & Pinning',
        description:
          'All sent requests are saved to history. Pin important requests for quick re-use.',
      },
      {
        title: 'Response Chaining',
        description:
          'Automatically extract values from response JSON and save them as variables for use in subsequent requests.',
      },
    ]}
    faqs={[
      {
        question: 'What is cURL?',
        answer:
          'cURL is a command-line tool for making HTTP requests. It is widely used by developers to test API endpoints, inspect responses, and automate web interactions. The syntax is curl -X METHOD URL -H "Header: value" -d "body".',
      },
      {
        question: 'Is this a Postman alternative?',
        answer:
          'Yes. This tool provides core functionality similar to Postman — building HTTP requests, setting headers and auth, inspecting responses — entirely in your browser without installing any software.',
      },
      {
        question: 'Does this tool support HTTPS?',
        answer:
          'Yes. All HTTP and HTTPS requests are supported. Note that due to browser CORS policy, some API endpoints may block requests from browser-based clients. In those cases, a proxy or direct cURL from the command line is required.',
      },
      {
        question: 'Are my API keys stored anywhere?',
        answer:
          "API keys and auth tokens are stored locally in your browser's localStorage to preserve your workspace between sessions. They are never transmitted to any third-party server.",
      },
    ]}
  />
);

export default function Page() {
  return <CurlBuilderClient infoSection={curlInfoSection} />;
}
