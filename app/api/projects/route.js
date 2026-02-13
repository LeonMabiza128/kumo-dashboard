// app/api/projects/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listProjects, listApplications, createProject, createApplication } from '@/lib/coolify';

// GET /api/projects — list all projects with their apps
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [projects, apps] = await Promise.all([
      listProjects().catch(() => []),
      listApplications().catch(() => []),
    ]);

    // Enrich projects with app data
    const enriched = (Array.isArray(apps) ? apps : []).map(app => ({
      uuid: app.uuid,
      name: app.name || app.description || 'Unnamed',
      description: app.description || '',
      fqdn: app.fqdn || '',
      status: app.status || 'unknown',
      repository: app.git_repository || '',
      branch: app.git_branch || 'main',
      buildPack: app.build_pack || 'nixpacks',
      framework: detectFramework(app),
      createdAt: app.created_at,
      updatedAt: app.updated_at,
    }));

    return NextResponse.json({ projects: enriched });
  } catch (err) {
    return NextResponse.json({ error: err.message, projects: [] }, { status: 200 });
  }
}

// POST /api/projects — create new project + application
export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, repository, branch, domain } = await req.json();

    // First create a Coolify project
    const project = await createProject({ name, description: name });

    // Get the environment UUID from the project
    const envUuid = project.environments?.[0]?.uuid;

    // Create the application inside the project
    const app = await createApplication({
      project_uuid: project.uuid,
      environment_name: 'production',
      server_uuid: await getDefaultServerUuid(),
      destination_uuid: await getDefaultDestinationUuid(),
      type: 'public',
      name: name,
      description: name,
      git_repository: repository,
      git_branch: branch || 'main',
      build_pack: 'nixpacks',
      ports_exposes: '3000',
      fqdn: domain ? `https://${domain}` : undefined,
    });

    return NextResponse.json({ project, application: app });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function detectFramework(app) {
  const repo = (app.git_repository || '').toLowerCase();
  const buildPack = (app.build_pack || '').toLowerCase();
  if (buildPack === 'nextjs' || repo.includes('next')) return 'Next.js';
  if (repo.includes('react')) return 'React';
  if (repo.includes('vue') || repo.includes('nuxt')) return 'Vue';
  if (repo.includes('svelte')) return 'Svelte';
  if (repo.includes('astro')) return 'Astro';
  if (buildPack === 'static') return 'Static';
  if (buildPack === 'dockerfile') return 'Docker';
  return 'Node.js';
}

async function getDefaultServerUuid() {
  const { listServers } = await import('@/lib/coolify');
  const servers = await listServers().catch(() => []);
  return servers?.[0]?.uuid || '';
}

async function getDefaultDestinationUuid() {
  const { listServers } = await import('@/lib/coolify');
  const servers = await listServers().catch(() => []);
  // Get the first server's first destination (docker network)
  const server = servers?.[0];
  if (server?.settings?.destinations?.[0]) {
    return server.settings.destinations[0].uuid;
  }
  // Fallback — try to get from server resources
  return '';
}
