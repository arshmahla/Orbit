import { createServerFn } from "@tanstack/react-start";

export interface GhCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}
export interface GhPull {
  number: number;
  title: string;
  author: string;
  url: string;
}
export interface GhIssue {
  number: number;
  title: string;
  author: string;
  url: string;
}
export interface GhActivity {
  commits: GhCommit[];
  pulls: GhPull[];
  issues: GhIssue[];
}

const HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "orbit-app",
};

export const fetchGithubActivity = createServerFn({ method: "POST" })
  .inputValidator((input: { owner: string; repo: string }) => {
    if (!input?.owner || !input?.repo) throw new Error("owner and repo required");
    if (!/^[\w.-]{1,100}$/.test(input.owner) || !/^[\w.-]{1,100}$/.test(input.repo)) {
      throw new Error("invalid owner/repo");
    }
    return input;
  })
  .handler(async ({ data }): Promise<GhActivity> => {
    const base = `https://api.github.com/repos/${data.owner}/${data.repo}`;
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = { ...HEADERS };
    if (token) headers.Authorization = `Bearer ${token}`;

    const [commitsRes, pullsRes, issuesRes] = await Promise.all([
      fetch(`${base}/commits?per_page=10`, { headers }),
      fetch(`${base}/pulls?state=open&per_page=10`, { headers }),
      fetch(`${base}/issues?state=open&per_page=10`, { headers }),
    ]);

    if (!commitsRes.ok) throw new Error(`GitHub: ${commitsRes.status}`);

    const commitsRaw = (await commitsRes.json()) as Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author: { name: string; date: string } };
    }>;
    const pullsRaw = pullsRes.ok ? ((await pullsRes.json()) as Array<{
      number: number; title: string; html_url: string; user: { login: string };
    }>) : [];
    const issuesRaw = issuesRes.ok ? ((await issuesRes.json()) as Array<{
      number: number; title: string; html_url: string; user: { login: string }; pull_request?: unknown;
    }>) : [];

    return {
      commits: commitsRaw.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name ?? "unknown",
        date: c.commit.author?.date ?? "",
        url: c.html_url,
      })),
      pulls: pullsRaw.map((p) => ({
        number: p.number,
        title: p.title,
        author: p.user?.login ?? "unknown",
        url: p.html_url,
      })),
      // GitHub returns PRs in /issues; filter them out
      issues: issuesRaw
        .filter((i) => !i.pull_request)
        .map((i) => ({
          number: i.number,
          title: i.title,
          author: i.user?.login ?? "unknown",
          url: i.html_url,
        })),
    };
  });
