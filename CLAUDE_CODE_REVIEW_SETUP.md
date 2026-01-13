# Setting Up Claude Code Review with OAuth (Pro/Max)

This guide documents how to set up automatic Claude code reviews on PRs using OAuth authentication with Claude Pro or Max subscription (no separate API billing required).

Uses: https://github.com/anthropics/claude-code-action

## Prerequisites

- Claude Pro or Max subscription
- GitHub repository where you want code reviews
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)

## Authentication Options

| Method | Secret Name | For Who |
|--------|-------------|---------|
| API Key | `ANTHROPIC_API_KEY` | Pay-per-use API users |
| **OAuth Token** | `CLAUDE_CODE_OAUTH_TOKEN` | **Pro and Max users** |

This guide uses the **OAuth Token** method.

---

## Step 1: Generate OAuth Token

In your terminal, run:

```bash
claude setup-token
```

This will:
1. Authenticate with your Claude account (Pro/Max)
2. Generate an OAuth token
3. Display the token for you to copy

**Copy the generated token** — you'll need it in Step 2.

## Step 2: Add Token to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Set:
   - **Name:** `CLAUDE_CODE_OAUTH_TOKEN`
   - **Value:** paste the token from Step 1
5. Click **"Add secret"**

## Step 3: Create the GitHub Actions Workflow

Create the file `.github/workflows/claude-review.yml`:

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'pull_request' ||
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude'))
    permissions:
      contents: read
      pull-requests: write
      issues: write
      id-token: write
    steps:
      - name: Run Claude Code Action
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

Commit and push this file to your main branch.

## Step 4: Test the Setup

1. Create a new branch with some changes
2. Open a Pull Request
3. The "Claude Code Review" workflow should trigger automatically
4. Claude will post a review comment on your PR

You can also mention `@claude` in any PR comment to ask questions.

---

## Troubleshooting

### Error: "Could not fetch an OIDC token"
Make sure `id-token: write` is in the workflow permissions.

### Error: "Bad credentials" / 401
- Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret was added correctly
- Regenerate the token with `claude setup-token` and update the secret

### Claude doesn't respond to @claude mentions
- Check that `issue_comment` and `pull_request_review_comment` triggers are in the workflow
- Verify the `if` condition includes the comment event types

---

## Summary

1. `claude setup-token` → generates OAuth token
2. Add token as `CLAUDE_CODE_OAUTH_TOKEN` secret in GitHub
3. Add workflow file to `.github/workflows/claude-review.yml`
4. Open a PR → Claude reviews automatically

---

*Last updated: January 2026*
