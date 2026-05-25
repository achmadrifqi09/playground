import JsonPhpConverterClient from './JsonPhpConverterClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { jsonPhpConverterMetadata } from '@/constants/metadata';
export const metadata = jsonPhpConverterMetadata;

const jsonPhpInfoSection = (
  <ToolInfoSection
    introduction="When working between PHP backends and JSON-based APIs or frontends, you often need to convert data between JSON format and PHP array syntax. This tool converts JSON objects and arrays to PHP associative array syntax and vice versa — supporting any level of nesting. All conversion happens instantly in your browser without any server interaction."
    steps={[
      {
        step: 1,
        title: 'Choose conversion direction',
        description:
          'Select "JSON to PHP" or "PHP to JSON" using the Switch Direction button. The input and output labels update accordingly.',
      },
      {
        step: 2,
        title: 'Paste your input',
        description: 'Paste your JSON object or PHP associative array into the left input panel.',
      },
      {
        step: 3,
        title: 'View the converted output',
        description:
          'The converted result appears instantly in the right panel as you type, with proper formatting and indentation.',
      },
      {
        step: 4,
        title: 'Copy the result',
        description: 'Click the copy button to copy the converted output to your clipboard.',
      },
    ]}
    features={[
      {
        title: 'Bidirectional Conversion',
        description:
          'Convert JSON to PHP array and PHP array to JSON in both directions with a single click.',
      },
      {
        title: 'Nested Structure Support',
        description:
          'Handles deeply nested objects, associative arrays, indexed arrays, booleans, nulls, and numbers.',
      },
      {
        title: 'Real-Time Conversion',
        description: 'Output updates instantly as you type — no button click required.',
      },
      {
        title: 'Local State Persistence',
        description:
          'Your last input and mode are saved in localStorage and restored on your next visit.',
      },
    ]}
    faqs={[
      {
        question: 'What is the difference between JSON and a PHP array?',
        answer:
          'JSON uses curly braces {} for objects, square brackets [] for arrays, colons : for key-value pairs, and double quotes for strings. PHP arrays use array() or [] notation with => for key-value pairs and single or double quotes for strings.',
      },
      {
        question: 'Can this tool handle nested PHP arrays?',
        answer:
          'Yes. The converter handles any depth of nested objects and arrays, including mixed associative and indexed arrays.',
      },
      {
        question: 'Does this support the old PHP array() syntax?',
        answer:
          'Yes. The PHP-to-JSON parser supports both the modern [] short array syntax and the legacy array() function syntax, as well as PHP comments (//, /* */, #).',
      },
      {
        question: 'Is this tool useful for Laravel or Symfony development?',
        answer:
          'Yes. PHP arrays are used extensively in Laravel config files, Eloquent model attributes, and response transformers. This tool helps quickly convert JSON API responses to the PHP array format needed in your backend code.',
      },
    ]}
  />
);

export default function Page() {
  return <JsonPhpConverterClient infoSection={jsonPhpInfoSection} />;
}
