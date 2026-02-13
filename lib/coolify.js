// lib/coolify.js — Full Coolify API client
const COOLIFY_URL = process.env.COOLIFY_API_URL || 'http://localhost:8000';
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN || '';

async function coolifyFetch(path, options = {}) {
  const url = `${COOLIFY_URL}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${COOLIFY_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Coolify API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// ─── Teams ───
export async function getTeams() {
  return coolifyFetch('/teams');
}

// ─── Projects ───
export async function listProjects() {
  return coolifyFetch('/projects');
}

export async function getProject(uuid) {
  return coolifyFetch(`/projects/${uuid}`);
}

export async function createProject(data) {
  return coolifyFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(uuid) {
  return coolifyFetch(`/projects/${uuid}`, { method: 'DELETE' });
}

// ─── Applications (Resources) ───
export async function listApplications() {
  return coolifyFetch('/applications');
}

export async function getApplication(uuid) {
  return coolifyFetch(`/applications/${uuid}`);
}

export async function createApplication(data) {
  return coolifyFetch('/applications/public', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateApplication(uuid, data) {
  return coolifyFetch(`/applications/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteApplication(uuid) {
  return coolifyFetch(`/applications/${uuid}`, { method: 'DELETE' });
}

export async function deployApplication(uuid, data = {}) {
  return coolifyFetch(`/applications/${uuid}/restart`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getApplicationLogs(uuid, lines = 100) {
  return coolifyFetch(`/applications/${uuid}/logs?lines=${lines}`);
}

// ─── Databases ───
export async function listDatabases() {
  return coolifyFetch('/databases');
}

export async function getDatabase(uuid) {
  return coolifyFetch(`/databases/${uuid}`);
}

export async function createDatabase(data) {
  return coolifyFetch(`/databases/${data.type || 'postgresql'}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteDatabase(uuid) {
  return coolifyFetch(`/databases/${uuid}`, { method: 'DELETE' });
}

// ─── Servers ───
export async function listServers() {
  return coolifyFetch('/servers');
}

export async function getServer(uuid) {
  return coolifyFetch(`/servers/${uuid}`);
}

export async function getServerResources(uuid) {
  return coolifyFetch(`/servers/${uuid}/resources`);
}

// ─── Services ───
export async function listServices() {
  return coolifyFetch('/services');
}

// ─── Deployments ───
export async function listDeployments(uuid) {
  return coolifyFetch(`/applications/${uuid}/deployments`);
}

export async function getDeployment(appUuid, deployUuid) {
  return coolifyFetch(`/applications/${appUuid}/deployments/${deployUuid}`);
}

// ─── Health Check ───
export async function healthCheck() {
  try {
    await coolifyFetch('/healthcheck');
    return true;
  } catch {
    return false;
  }
}

export default {
  listProjects, getProject, createProject, deleteProject,
  listApplications, getApplication, createApplication, updateApplication,
  deleteApplication, deployApplication, getApplicationLogs,
  listDatabases, getDatabase, createDatabase, deleteDatabase,
  listServers, getServer, getServerResources,
  listServices, listDeployments, getDeployment,
  healthCheck, getTeams,
};
