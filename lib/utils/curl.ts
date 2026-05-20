export interface ParsedCurl {
  url: string;
  method: string;
  headers: { key: string; value: string }[];
  body: string;
  bodyType: 'json' | 'form-data' | 'urlencoded' | 'raw';
}

export function parseCurlCommand(curlStr: string): ParsedCurl {
  const result: ParsedCurl = {
    url: '',
    method: 'GET',
    headers: [],
    body: '',
    bodyType: 'raw',
  };

  const cleanCommand = curlStr.trim().replace(/\\\n/g, ' ');
  
  const urlRegex = /(?:["'])(https?:\/\/[^\s"']+)(?:["'])|https?:\/\/[^\s"']+/i;
  const urlMatch = cleanCommand.match(urlRegex);
  if (urlMatch) {
    result.url = urlMatch[1] || urlMatch[0];
  }

  const methodRegex = /(?:-X|--request)\s+["']?([A-Z]+)["']?/i;
  const methodMatch = cleanCommand.match(methodRegex);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
  } else if (cleanCommand.includes('-d ') || cleanCommand.includes('--data ') || cleanCommand.includes('--data-raw ') || cleanCommand.includes('--data-binary ')) {
    result.method = 'POST';
  }

  const headerRegex = /(?:-H|--header)\s+["']([^"']+)["']/gi;
  let match;
  while ((match = headerRegex.exec(cleanCommand)) !== null) {
    const headerStr = match[1];
    const colonIndex = headerStr.indexOf(':');
    if (colonIndex !== -1) {
      const key = headerStr.slice(0, colonIndex).trim();
      const value = headerStr.slice(colonIndex + 1).trim();
      result.headers.push({ key, value });
    }
  }

  const dataRegex = /(?:-d|--data|--data-raw|--data-binary|--data-urlencode)\s+["']([\s\S]*?)["'](?=\s|$)/gi;
  const dataMatches: string[] = [];
  let dataMatch;
  while ((dataMatch = dataRegex.exec(cleanCommand)) !== null) {
    dataMatches.push(dataMatch[1]);
  }

  if (dataMatches.length > 0) {
    result.body = dataMatches.join('&');
    try {
      JSON.parse(result.body);
      result.bodyType = 'json';
    } catch (e) {
      if (result.body.includes('=') && result.body.includes('&')) {
        result.bodyType = 'urlencoded';
      } else {
        result.bodyType = 'raw';
      }
    }
  }

  return result;
}

export function generateCurlCommand(
  url: string,
  method: string,
  headers: { key: string; value: string }[],
  body: string
): string {
  let curl = `curl -X ${method} "${url}"`;
  
  headers.forEach(h => {
    if (h.key && h.value) {
      curl += ` \\\n  -H "${h.key}: ${h.value}"`;
    }
  });

  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const escapedBody = body.replace(/"/g, '\\"');
    curl += ` \\\n  -d "${escapedBody}"`;
  }

  return curl;
}

export function generateFetchCode(
  url: string,
  method: string,
  headers: { key: string; value: string }[],
  body: string
): string {
  const headerObj: Record<string, string> = {};
  headers.forEach(h => {
    if (h.key && h.value) {
      headerObj[h.key] = h.value;
    }
  });

  const options: {
    method: string;
    headers: Record<string, string>;
    body?: string | Record<string, unknown>;
  } = {
    method,
    headers: headerObj,
  };

  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    try {
      options.body = JSON.parse(body);
    } catch (e) {
      options.body = body;
    }
  }

  return `fetch("${url}", ${JSON.stringify(options, null, 2).replace(/"body":\s*"({[\s\S]*?})"/g, '"body": JSON.stringify($1)')});`;
}

export function generateNodeCode(
  url: string,
  method: string,
  headers: { key: string; value: string }[],
  body: string
): string {
  const headerObj: Record<string, string> = {};
  headers.forEach(h => {
    if (h.key && h.value) {
      headerObj[h.key] = h.value;
    }
  });

  return `const axios = require('axios');

const config = {
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(headerObj, null, 2)},
  data: ${body ? (body.trim().startsWith('{') ? body : `'${body}'`) : 'null'}
};

axios(config)
  .then(response => {
    console.log(JSON.stringify(response.data));
  })
  .catch(error => {
    console.log(error);
  });`;
}
