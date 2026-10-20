import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const issuesPath = path.resolve('scripts/issues.json');
const mapPath = path.resolve('scripts/issue-map.json');

const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf8'));
const issueMap = {};

console.log(`Starting sync of ${issues.length} issues to GitHub...`);

const tempBodyFile = path.resolve('scripts/.temp_issue_body.md');

const ghExe = '"C:\\Program Files\\GitHub CLI\\gh.exe"';

for (const issue of issues) {
  fs.writeFileSync(tempBodyFile, issue.body, 'utf8');
  const labelsArg = issue.labels.map(l => `--label "${l}"`).join(' ');
  const escapedTitle = issue.title.replace(/"/g, '\\"');
  const cmd = `${ghExe} issue create --title "${escapedTitle}" ${labelsArg} --body-file "${tempBodyFile}"`;
  
  console.log(`Creating Issue #${issue.id}: ${issue.title}`);
  const output = execSync(cmd, { encoding: 'utf8' }).trim();
  // gh issue create returns the URL, e.g. https://github.com/owner/repo/issues/1
  const match = output.match(/\/issues\/(\d+)$/);
  const realNumber = match ? parseInt(match[1], 10) : null;
  
  issueMap[issue.id] = {
    backlogId: issue.id,
    realNumber,
    url: output,
    title: issue.title,
    labels: issue.labels,
  };
  console.log(`-> Created as GitHub Issue #${realNumber}: ${output}`);
}

if (fs.existsSync(tempBodyFile)) {
  fs.unlinkSync(tempBodyFile);
}

fs.writeFileSync(mapPath, JSON.stringify(issueMap, null, 2), 'utf8');
console.log('\nSuccessfully synced all 20 issues. Map saved to scripts/issue-map.json:\n');
console.table(Object.values(issueMap).map(i => ({
  BacklogID: i.backlogId,
  GitHubNumber: i.realNumber,
  Title: i.title.substring(0, 45) + '...',
  Labels: i.labels.join(', '),
  URL: i.url
})));
