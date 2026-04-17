import { useQuery } from "@tanstack/react-query";
import { GitCommit, GitPullRequest, CircleDot, ExternalLink, Github } from "lucide-react";
import { fetchGithubActivity } from "@/server/github";

interface Props {
  owner: string | null;
  repo: string | null;
}

export function GitHubPanel({ owner, repo }: Props) {
  const enabled = Boolean(owner && repo);
  const { data, isLoading, error } = useQuery({
    queryKey: ["github", owner, repo],
    queryFn: () => fetchGithubActivity({ data: { owner: owner!, repo: repo! } }),
    enabled,
    staleTime: 60_000,
  });

  if (!enabled) {
    return (
      <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
        <Github className="mx-auto mb-2 h-5 w-5" />
        Connect a GitHub repo in project settings to see commits, PRs, and issues.
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading GitHub activity…</p>;
  }

  if (error || !data) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Couldn't load GitHub data. Check the owner/repo and that it's public.
      </div>
    );
  }

  const repoUrl = `https://github.com/${owner}/${repo}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Github className="h-4 w-4" />
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:text-accent"
          >
            {owner}/{repo}
          </a>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <Section title="Recent commits" icon={<GitCommit className="h-4 w-4" />}>
        {data.commits.length === 0 ? (
          <Empty text="No commits yet." />
        ) : (
          <ul className="divide-y divide-border">
            {data.commits.map((c) => (
              <li key={c.sha} className="py-2.5">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-medium text-foreground hover:text-accent line-clamp-1"
                >
                  {c.message.split("\n")[0]}
                </a>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {c.author} · {new Date(c.date).toLocaleDateString()} ·{" "}
                  <span className="font-mono">{c.sha.slice(0, 7)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Open pull requests" icon={<GitPullRequest className="h-4 w-4" />}>
          {data.pulls.length === 0 ? (
            <Empty text="No open PRs." />
          ) : (
            <ul className="space-y-2">
              {data.pulls.map((p) => (
                <li key={p.number}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm hover:text-accent"
                  >
                    <span className="font-medium">#{p.number}</span> {p.title}
                  </a>
                  <div className="text-xs text-muted-foreground">by {p.author}</div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Open issues" icon={<CircleDot className="h-4 w-4" />}>
          {data.issues.length === 0 ? (
            <Empty text="No open issues." />
          ) : (
            <ul className="space-y-2">
              {data.issues.map((i) => (
                <li key={i.number}>
                  <a
                    href={i.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm hover:text-accent"
                  >
                    <span className="font-medium">#{i.number}</span> {i.title}
                  </a>
                  <div className="text-xs text-muted-foreground">by {i.author}</div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-muted-foreground">{text}</div>;
}
