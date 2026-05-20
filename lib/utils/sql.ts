export interface SqlAnalysis {
  dangerousQueries: { title: string; desc: string; severity: 'critical' | 'warning' }[];
  warnings: { title: string; desc: string; severity: 'warning' | 'info' }[];
  readabilityScore: number;
  complexityInfo: {
    length: number;
    nestingDepth: number;
    selectCount: number;
    joinCount: number;
    whereConditionsCount: number;
  };
  structure: {
    columns: string[];
    tables: string[];
    joins: { type: string; table: string; on: string }[];
    where: string[];
  };
}

export function minifySql(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatSql(sql: string, dialect: string = 'mysql'): string {
  let cleaned = sql
    .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
    'DELETE FROM', 'UNION', 'UNION ALL', 'ON', 'AND', 'OR', 'AS', 'IN', 'EXISTS'
  ];

  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    cleaned = cleaned.replace(regex, kw);
  });

  let indentLevel = 0;
  const getIndent = () => '  '.repeat(indentLevel);
  let formatted = '';
  
  const tokens = cleaned.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(token)) {
      if (i > 0) formatted += '\n';
      formatted += getIndent() + token + ' ';
    } else if (['FROM', 'WHERE', 'SET', 'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'UNION'].includes(token)) {
      formatted += '\n' + getIndent();
      if (token === 'GROUP' || token === 'ORDER') {
        formatted += token + ' ' + (tokens[i + 1] === 'BY' ? 'BY' : '');
        if (tokens[i + 1] === 'BY') i++;
      } else {
        formatted += token;
      }
      formatted += ' ';
    } else if (token.includes('JOIN')) {
      formatted += '\n' + getIndent() + token + ' ';
    } else if (token === 'AND' || token === 'OR') {
      formatted += '\n' + getIndent() + '  ' + token + ' ';
    } else if (token === '(') {
      formatted += ' (\n';
      indentLevel++;
      formatted += getIndent();
    } else if (token === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += '\n' + getIndent() + ') ';
    } else {
      formatted += token + ' ';
    }
  }

  return formatted.replace(/\s+\n/g, '\n').replace(/\n+/g, '\n').trim();
}

export function analyzeSqlQuery(sql: string): SqlAnalysis {
  const cleanSql = sql.toUpperCase();
  const dangerousQueries: SqlAnalysis['dangerousQueries'] = [];
  const warnings: SqlAnalysis['warnings'] = [];

  const hasDelete = cleanSql.includes('DELETE');
  const hasUpdate = cleanSql.includes('UPDATE');
  const hasDrop = cleanSql.includes('DROP');
  const hasWhere = cleanSql.includes('WHERE');

  if (hasDelete && !hasWhere) {
    dangerousQueries.push({
      title: 'CRITICAL: DELETE Without WHERE Clause',
      desc: 'Executing this query will delete ALL rows in the target table. This is extremely hazardous.',
      severity: 'critical',
    });
  }

  if (hasUpdate && !hasWhere) {
    dangerousQueries.push({
      title: 'CRITICAL: UPDATE Without WHERE Clause',
      desc: 'Executing this query will overwrite the target columns for ALL rows in the table.',
      severity: 'critical',
    });
  }

  if (hasDrop) {
    dangerousQueries.push({
      title: 'CRITICAL: DROP Statement Detected',
      desc: 'A DROP statement permanently deletes databases, tables, or indexes. Ensure this is intentional.',
      severity: 'critical',
    });
  }

  if (cleanSql.includes('SELECT *')) {
    warnings.push({
      title: 'SELECT * Anti-Pattern',
      desc: 'Selecting all fields degrades performance. Specify exact columns to minimize payload size.',
      severity: 'warning',
    });
  }

  if (cleanSql.includes('JOIN') && !cleanSql.includes('ON') && !cleanSql.includes('USING')) {
    warnings.push({
      title: 'Potential Cartesian Product (Cross Join)',
      desc: 'Your join does not have an ON condition. This can produce exponential row products, crashing the DB.',
      severity: 'warning',
    });
  }

  const matches1 = cleanSql.match(/WHERE\s+1\s*=\s*1/gi);
  if (matches1) {
    warnings.push({
      title: 'Placeholder Condition (1=1)',
      desc: 'Using "1=1" is typical for dynamic queries but can sometimes be removed in production SQL.',
      severity: 'info',
    });
  }

  const selectCount = (cleanSql.match(/\bSELECT\b/g) || []).length;
  const joinCount = (cleanSql.match(/\bJOIN\b/g) || []).length;
  const whereConditionsCount = (cleanSql.match(/\bAND\b|\bOR\b|\bWHERE\b/g) || []).length;
  
  let maxDepth = 0;
  let currentDepth = 0;
  for (let i = 0; i < cleanSql.length; i++) {
    if (cleanSql[i] === '(') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (cleanSql[i] === ')') {
      currentDepth = Math.max(0, currentDepth - 1);
    }
  }

  let readability = 100;
  readability -= selectCount * 10;
  readability -= joinCount * 12;
  readability -= maxDepth * 15;
  readability -= Math.min(25, Math.floor(cleanSql.length / 100));
  readability = Math.max(0, Math.min(100, readability));

  const columns: string[] = [];
  const tables: string[] = [];
  const joins: SqlAnalysis['structure']['joins'] = [];
  const where: string[] = [];

  const selectMatch = sql.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
  if (selectMatch) {
    const cols = selectMatch[1].split(',');
    cols.forEach(c => columns.push(c.trim()));
  }

  const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
  if (fromMatch) {
    tables.push(fromMatch[1].trim());
  }

  const joinRegex = /(LEFT|RIGHT|INNER|OUTER|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+([\s\S]*?)(?=\s+JOIN|\s+WHERE|\s+GROUP|\s+ORDER|$)/gi;
  let joinMatch;
  while ((joinMatch = joinRegex.exec(sql)) !== null) {
    joins.push({
      type: (joinMatch[1] || 'INNER').trim().toUpperCase(),
      table: joinMatch[2].trim(),
      on: joinMatch[3].trim(),
    });
  }

  const whereMatch = sql.match(/WHERE\s+([\s\S]*?)(?=\s+GROUP|\s+ORDER|\s+LIMIT|$)/i);
  if (whereMatch) {
    whereMatch[1].split(/\bAND\b|\bOR\b/gi).forEach(cond => {
      where.push(cond.trim());
    });
  }

  return {
    dangerousQueries,
    warnings,
    readabilityScore: Math.round(readability),
    complexityInfo: {
      length: sql.length,
      nestingDepth: maxDepth,
      selectCount,
      joinCount,
      whereConditionsCount,
    },
    structure: {
      columns,
      tables,
      joins,
      where,
    },
  };
}
