import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ghExe = '"C:\\Program Files\\GitHub CLI\\gh.exe"';

const output = execSync(`${ghExe} issue list --state all --json number,title,state,labels,url`, { encoding: 'utf8' });
const issues = JSON.parse(output);

// Sort by issue number ascending
issues.sort((a, b) => a.number - b.number);

let md = `# GitHub Issues Tracker (Live Mirror)\n\n`;
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `| # | Title | State | Labels | Link |\n`;
md += `|---|-------|-------|--------|------|\n`;

for (const issue of issues) {
  const labels = issue.labels.map(l => `\`${l.name}\``).join(' ');
  const stateBadge = issue.state === 'OPEN' ? '🟢 OPEN' : '🟣 CLOSED';
  md += `| ${issue.number} | ${issue.title} | ${stateBadge} | ${labels} | [View Issue](${issue.url}) |\n`;
}

fs.writeFileSync('GITHUB_ISSUES.md', md, 'utf8');
console.log('Updated GITHUB_ISSUES.md successfully.');
