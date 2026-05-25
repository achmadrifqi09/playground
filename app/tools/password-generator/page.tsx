import PasswordGeneratorClient from './PasswordGeneratorClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { passwordGeneratorMetadata } from '@/constants/metadata';
export const metadata = passwordGeneratorMetadata;

const passwordInfoSection = (
  <ToolInfoSection
    introduction="A strong password is your first line of defense against unauthorized access. This tool generates cryptographically random passwords using the Web Crypto API, ensuring no pattern or predictability exists in the output. Password strength is measured using entropy — the higher the entropy, the more resistant the password is to brute-force attacks."
    steps={[
      {
        step: 1,
        title: 'Set the password length',
        description:
          'Drag the slider or type a number to set your desired password length between 8 and 128 characters.',
      },
      {
        step: 2,
        title: 'Choose character sets',
        description:
          'Check the boxes to include uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols. Enabling more character sets increases password strength.',
      },
      {
        step: 3,
        title: 'Click Generate Password',
        description:
          'A new random password is generated. The entropy indicator shows the strength in bits — aim for at least 80 bits for strong security.',
      },
      {
        step: 4,
        title: 'Copy and store securely',
        description:
          'Copy the password and store it in a password manager such as Bitwarden, 1Password, or KeePass.',
      },
    ]}
    features={[
      {
        title: 'Customizable Character Sets',
        description: 'Mix uppercase, lowercase, numbers, and symbols to match any password policy.',
      },
      {
        title: 'Entropy Strength Indicator',
        description:
          'Displays password entropy in bits so you can quantitatively assess the strength of each generated password.',
      },
      {
        title: 'Adjustable Length',
        description: 'Set passwords from 8 to 128 characters using a slider or direct input.',
      },
      {
        title: 'Cryptographically Random',
        description:
          'Uses the Web Crypto API for true randomness — not Math.random(), which is predictable.',
      },
    ]}
    faqs={[
      {
        question: 'What makes a password strong?',
        answer:
          'Password strength depends on length and character variety. A 16-character password using all character sets has over 100 bits of entropy, making it practically unbreakable. Avoid dictionary words, personal information, and predictable patterns.',
      },
      {
        question: 'What is password entropy?',
        answer:
          'Entropy measures the unpredictability of a password in bits. It is calculated as length × log2(character set size). A password with 80+ bits of entropy is considered strong by modern security standards.',
      },
      {
        question: 'How should I store generated passwords?',
        answer:
          'Use a reputable password manager such as Bitwarden, 1Password, KeePass, or LastPass. Never store passwords in plain text files.',
      },
      {
        question: 'Is the generated password sent to any server?',
        answer:
          'No. Password generation happens entirely inside your browser. No generated password is ever transmitted over the network.',
      },
    ]}
  />
);

export default function Page() {
  return <PasswordGeneratorClient infoSection={passwordInfoSection} />;
}
