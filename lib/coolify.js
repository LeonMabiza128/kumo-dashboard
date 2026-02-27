var API_URL = process.env.COOLIFY_API_URL || 'http://154.66.198.81:8000';
var API_TOKEN = process.env.COOLIFY_API_TOKEN || '';

async function coolifyFetch(path, options) {
  var url = API_URL + '/api/v1' + path;
  var headers = { 'Authorization': 'Bearer ' + API_TOKEN, 'Content-Type': 'application/json', 'Accept': 'application/json' };
  var res = await fetch(url, Object.assign({ headers: headers }, options || {}));
  if (!res.ok) { var text = await res.text(); throw new Error('Coolify API error ' + res.status + ': ' + text); }
  return res.json();
}

export function listProjects() { return coolifyFetch('/projects'); }
export function createProject(data) { return coolifyFetch('/projects', { method: 'POST', body: JSON.stringify(data) }); }
export function getProject(uuid) { return coolifyFetch('/projects/' + uuid); }
export function deleteProject(uuid) { return coolifyFetch('/projects/' + uuid, { method: 'DELETE' }); }
export function listApplications() { return coolifyFetch('/applications'); }
export function getApplication(uuid) { return coolifyFetch('/applications/' + uuid); }
export function createApplication(data) { return coolifyFetch('/applications/public', { method: 'POST', body: JSON.stringify(data) }); }
export function updateApplication(uuid, data) { return coolifyFetch('/applications/' + uuid, { method: 'PATCH', body: JSON.stringify(data) }); }
export function deleteApplication(uuid) { return coolifyFetch('/applications/' + uuid, { method: 'DELETE' }); }
export function deployApplication(uuid) { return coolifyFetch('/applications/' + uuid + '/deploy', { method: 'POST' }); }
export function getApplicationLogs(uuid) { return coolifyFetch('/applications/' + uuid + '/logs?since=1h').catch(function() { return { logs: '' }; }); }
export function getDeployments(uuid) { return coolifyFetch('/applications/' + uuid + '/deployments').catch(function() { return []; }); }
export function getDeploymentLogs(uuid) { return coolifyFetch('/deployments/' + uuid).catch(function() { return { logs: '' }; }); }
export function listDatabases() { return coolifyFetch('/databases').catch(function() { return []; }); }
export function listServers() { return coolifyFetch('/servers'); }
