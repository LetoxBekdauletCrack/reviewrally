import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ghExe = '"C:\\Program Files\\GitHub CLI\\gh.exe"';

const action = process.argv[2]; // 'start' | 'implement' | 'comment' | 'close' | 'bug-repro' | 'bug-groom' | 'bug-cases' | 'bug-verify'
const issueNumber = process.argv[3];
const customText = process.argv.slice(4).join(' ');

if (!action || !issueNumber) {
  console.error('Usage: node scripts/issue-action.mjs <action> <issueNumber> [text]');
  process.exit(1);
}

const tempFile = path.resolve('scripts/.temp_action_msg.txt');

function runGh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (err) {
    console.error(`Error running: ${cmd}\n`, err.stderr || err.message);
    throw err;
  }
}

let body = '';
let isClose = false;

if (action === 'start') {
  body = '🚧 developer.md started work.';
} else if (action === 'implement') {
  body = `✅ Implemented: ${customText}. Ready for QA.`;
} else if (action === 'comment') {
  body = customText;
} else if (action === 'close') {
  isClose = true;
  body = customText || '✅ Closed by qa-engineer.md';
}

fs.writeFileSync(tempFile, body, 'utf8');

if (isClose) {
  runGh(`${ghExe} issue close ${issueNumber} --comment "${body.replace(/"/g, '\\"')}"`);
  console.log(`Closed issue #${issueNumber} with comment: ${body}`);
} else {
  runGh(`${ghExe} issue comment ${issueNumber} --body-file "${tempFile}"`);
  console.log(`Commented on issue #${issueNumber}: ${body}`);
}

if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}
