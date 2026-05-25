import SqlFormatterClient from './SqlFormatterClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { sqlFormatterMetadata } from '@/constants/metadata';
export const metadata = sqlFormatterMetadata;

const sqlInfoSection = (
  <ToolInfoSection
    introduction="SQL formatting is essential for maintaining readable, maintainable database code. This tool formats, minifies, and analyzes SQL queries directly in your browser. It supports MySQL, PostgreSQL, SQLite, and SQL Server dialects and automatically detects dangerous patterns such as UPDATE statements without a WHERE clause, SELECT *, and deeply nested subqueries that may impact performance."
    steps={[
      {
        step: 1,
        title: 'Select your SQL dialect',
        description:
          'Choose the target database dialect (MySQL, PostgreSQL, SQLite, or SQL Server) from the dropdown menu.',
      },
      {
        step: 2,
        title: 'Paste your SQL query',
        description:
          'Type or paste your SQL query into the input area. The formatter analyzes it automatically.',
      },
      {
        step: 3,
        title: 'Format or Minify',
        description:
          'Click "Formatter" to beautify the query with proper indentation, or click "Minify" to compress it to a single line for production use.',
      },
      {
        step: 4,
        title: 'Review the diagnostics',
        description:
          'Switch to the "Diagnostics" tab to see detected dangerous patterns, anti-patterns, and performance warnings. Use the "Query Visualizer" to understand the query structure.',
      },
    ]}
    features={[
      {
        title: 'Multi-Dialect Support',
        description:
          'Formats SQL for MySQL, PostgreSQL, SQLite, and SQL Server with dialect-aware formatting rules.',
      },
      {
        title: 'SQL Beautifier & Minifier',
        description:
          'Beautify messy SQL with proper indentation or compress it to a single line for embedding in code.',
      },
      {
        title: 'Dangerous Query Detection',
        description:
          'Automatically flags UPDATE/DELETE without WHERE, SELECT *, and other high-risk anti-patterns.',
      },
      {
        title: 'Readability Score',
        description:
          'Assigns a readability score based on nesting depth, join count, and query complexity.',
      },
      {
        title: 'Query Visualizer',
        description:
          'Breaks down the query into its structural components: SELECT targets, FROM tables, JOINs, and WHERE conditions.',
      },
      {
        title: '100% Offline',
        description:
          'All formatting and analysis runs locally — your SQL queries are never sent to a server.',
      },
    ]}
    faqs={[
      {
        question: 'Why should I format my SQL queries?',
        answer:
          'Formatted SQL is significantly easier to read, review, and debug. Consistent indentation makes it immediately clear which clauses belong together, especially in complex queries with multiple JOINs and nested subqueries.',
      },
      {
        question: 'What is a dangerous SQL query?',
        answer:
          'A dangerous SQL query is one that could cause unintended data loss or corruption. Common examples are UPDATE or DELETE statements without a WHERE clause (which modify all rows), or DROP TABLE statements. This tool highlights these patterns before you run them.',
      },
      {
        question: 'What is SELECT * and why is it an anti-pattern?',
        answer:
          'SELECT * retrieves all columns from a table. This is an anti-pattern because it transfers unnecessary data over the network, prevents query optimization, and breaks applications when the table schema changes.',
      },
      {
        question: 'Does this tool connect to a database?',
        answer:
          'No. This is a purely client-side formatting and analysis tool. It parses and formats your SQL text without any database connection.',
      },
    ]}
  />
);

export default function Page() {
  return <SqlFormatterClient infoSection={sqlInfoSection} />;
}
