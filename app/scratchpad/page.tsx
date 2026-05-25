import ScratchpadClient from './ScratchpadClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { scratchpadMetadata } from '@/constants/metadata';
export const metadata = scratchpadMetadata;

const scratchpadInfoSection = (
  <div className="max-w-4xl mx-auto px-4 pb-16">
    <ToolInfoSection
      introduction="The Scratchpad is a VS Code-inspired multi-tab workspace that lives entirely in your browser. Use it to temporarily store and organize .env variables, bash commands, SQL queries, JSON data, and developer notes. All content is persisted in your browser's localStorage — nothing is sent to a server, and it is available every time you return."
      steps={[
        {
          step: 1,
          title: 'Create a new tab',
          description:
            'Click the + button in the Explorer panel and choose the file type: ENV, Bash, SQL, JSON, or Notes.',
        },
        {
          step: 2,
          title: 'Write your content',
          description:
            'Type directly into the editor. Each tab has syntax appropriate for its type. Tabs auto-save as you type.',
        },
        {
          step: 3,
          title: 'Organize with multiple tabs',
          description:
            'Open as many tabs as you need. Switch between them using the tab bar at the top or the Explorer sidebar on the left.',
        },
        {
          step: 4,
          title: 'Close and reopen tabs',
          description:
            'Close tabs when done. Closed tabs are saved in "Recently Saved" and can be reopened at any time.',
        },
      ]}
      features={[
        {
          title: 'Multi-Tab Workspace',
          description:
            'Organize work across multiple named tabs, each with its own file type and content.',
        },
        {
          title: 'Multiple File Types',
          description:
            'Dedicated tabs for ENV variables, Bash commands, SQL queries, JSON data, and plain text notes.',
        },
        {
          title: 'Auto-Save to localStorage',
          description:
            "Content is automatically saved to your browser's localStorage as you type — no manual save required.",
        },
        {
          title: 'VS Code-Inspired UI',
          description:
            'Familiar editor layout with an Explorer sidebar, tab bar, and full-viewport editor area.',
        },
        {
          title: 'Closed Tab Recovery',
          description:
            'Closed tabs are stored in a "Recently Saved" section and can be reopened at any time.',
        },
        {
          title: '100% Private',
          description: 'All content stays in your browser. Nothing is ever uploaded to a server.',
        },
      ]}
      faqs={[
        {
          question: 'Is my data stored on a server?',
          answer:
            "No. All content in the Scratchpad is stored exclusively in your browser's localStorage. It is private to your device and browser and is never transmitted over a network.",
        },
        {
          question: 'What happens if I clear my browser cache?',
          answer:
            'Clearing browser data or localStorage will erase all Scratchpad content. If you have important content, copy it to a secure location before clearing browser storage.',
        },
        {
          question: 'Can I use this to store .env files?',
          answer:
            'Yes. The ENV tab is specifically designed for editing .env-style KEY=VALUE pairs. It is useful for temporarily holding environment variable values while working on a project.',
        },
        {
          question: 'Is there a character or file size limit?',
          answer:
            'There is no explicit limit imposed by the tool, but localStorage has a browser-imposed limit of approximately 5–10MB per origin. Very large amounts of data may cause performance issues.',
        },
      ]}
    />
  </div>
);

export default function Page() {
  return (
    <>
      <ScratchpadClient />
      {scratchpadInfoSection}
    </>
  );
}
