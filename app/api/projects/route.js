import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listApplications, createProject, createApplication, deployApplication } from '@/lib/coolify';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const apps = await listApplications().catch(() => []);
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

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, repository, branch } = await req.json();
    const project = await createProject({ name, description: name });
    const app = await createApplication({
      project_uuid: project.uuid,
      environment_name: 'production',
      server_uuid: 'hsgg40gscs8kcs8scwwko0ws',
      destination_uuid: 'zgog0wg4wksoc44k840s0co0',
      type: 'public',
      name: name,
      description: name,
      git_repository: repository,
      git_branch: branch || 'main',
      build_pack: 'nixpacks',
      ports_exposes: '3000',
    });

    // Auto-deploy after creation
    try {
      await deployApplication(app.uuid);
    } catch (e) {
      console.log('Auto-deploy trigger:', e.message);
    }

    return NextResponse.json({ project, application: app });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function detectFramework(app) {
  const repo = (app.git_repository || '').toLowerCase();
  const bp = (app.build_pack || '').toLowerCase();
  if (bp === 'nextjs' || repo.includes('next')) return 'Next.js';
  if (repo.includes('react')) return 'React';
  if (repo.includes('vue') || repo.includes('nuxt')) return 'Vue';
  if (repo.includes('svelte')) return 'Svelte';
  if (repo.includes('astro')) return 'Astro';
  if (bp === 'static') return 'Static';
  if (bp === 'dockerfile') return 'Docker';
  return 'Node.js';
}