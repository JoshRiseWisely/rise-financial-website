/**
 * Railway GraphQL API Module
 * Provides deployment automation for rise-financial-website-production
 *
 * API Endpoint: https://backboard.railway.com/graphql/v2
 * Auth: Bearer token via RAILWAY_API_TOKEN env var
 */

const RAILWAY_API_URL = 'https://backboard.railway.com/graphql/v2';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeploymentStatus =
  | 'BUILDING'
  | 'CRASHED'
  | 'DEPLOYING'
  | 'FAILED'
  | 'INITIALIZING'
  | 'NEEDS_APPROVAL'
  | 'QUEUED'
  | 'REMOVED'
  | 'REMOVING'
  | 'SKIPPED'
  | 'SLEEPING'
  | 'SUCCESS'
  | 'WAITING';

export interface RailwayApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Deployment {
  id: string;
  status: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
  url?: string;
  staticUrl?: string;
  serviceId?: string;
  environmentId: string;
  projectId: string;
  canRedeploy: boolean;
  canRollback: boolean;
  deploymentStopped: boolean;
}

export interface DeploymentLog {
  timestamp: string;
  message: string;
  severity?: string;
}

export interface ServiceInstance {
  id: string;
  serviceId: string;
  serviceName: string;
  environmentId: string;
  latestDeployment?: Deployment;
  buildCommand?: string;
  startCommand?: string;
  region?: string;
  numReplicas?: number;
}

export interface ServiceStatus {
  serviceId: string;
  serviceName: string;
  isUp: boolean;
  latestDeploymentStatus?: DeploymentStatus;
  latestDeploymentId?: string;
  deployedAt?: string;
  url?: string;
}

export interface Variable {
  name: string;
  value: string;
}

// ─── Core GraphQL Fetcher ─────────────────────────────────────────────────────

async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data?: T; errors?: Array<{ message: string; path?: string[] }> }> {
  const token = process.env.RAILWAY_API_TOKEN;
  if (!token) {
    throw new Error('RAILWAY_API_TOKEN environment variable is not set');
  }

  const response = await fetch(RAILWAY_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ─── Helper: wrap results in standard response shape ─────────────────────────

function ok<T>(data: T): RailwayApiResponse<T> {
  return { success: true, data };
}

function fail<T>(error: unknown): RailwayApiResponse<T> {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown error';
  return { success: false, error: message };
}

// ─── 1. Set Environment Variable ─────────────────────────────────────────────

/**
 * Set (upsert) an environment variable in Railway.
 *
 * Requires: projectId, environmentId (pass via options), and optionally serviceId.
 * If serviceId is omitted the variable is project-scoped (shared).
 */
export async function setVariable(
  projectId: string,
  key: string,
  value: string,
  options: {
    environmentId: string;
    serviceId?: string;
    skipDeploys?: boolean;
  }
): Promise<RailwayApiResponse<boolean>> {
  const mutation = `
    mutation VariableUpsert($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }
  `;

  try {
    const result = await gql<{ variableUpsert: boolean }>(mutation, {
      input: {
        projectId,
        environmentId: options.environmentId,
        serviceId: options.serviceId ?? null,
        name: key,
        value,
        skipDeploys: options.skipDeploys ?? false,
      },
    });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    return ok(result.data?.variableUpsert ?? false);
  } catch (err) {
    return fail(err);
  }
}

// ─── 2. Get All Variables ─────────────────────────────────────────────────────

/**
 * List all environment variables for a project/environment/service combo.
 * Returns a key→value record.
 */
export async function getVariables(
  projectId: string,
  options: {
    environmentId: string;
    serviceId?: string;
    unrendered?: boolean;
  }
): Promise<RailwayApiResponse<Record<string, string>>> {
  const query = `
    query Variables($projectId: String!, $environmentId: String!, $serviceId: String, $unrendered: Boolean) {
      variables(
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
        unrendered: $unrendered
      )
    }
  `;

  try {
    const result = await gql<{ variables: Record<string, string> }>(query, {
      projectId,
      environmentId: options.environmentId,
      serviceId: options.serviceId ?? null,
      unrendered: options.unrendered ?? false,
    });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    return ok(result.data?.variables ?? {});
  } catch (err) {
    return fail(err);
  }
}

// ─── 3. Get Deployment Logs ───────────────────────────────────────────────────

/**
 * Fetch build and runtime logs for a specific deployment.
 * Pass type: 'build' | 'deploy' (default 'deploy').
 */
export async function getDeploymentLogs(
  _projectId: string,
  deploymentId: string,
  options: {
    type?: 'build' | 'deploy';
    limit?: number;
    filter?: string;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<RailwayApiResponse<DeploymentLog[]>> {
  const logType = options.type ?? 'deploy';

  const query =
    logType === 'build'
      ? `
    query BuildLogs($deploymentId: String!, $limit: Int, $filter: String, $startDate: DateTime, $endDate: DateTime) {
      buildLogs(
        deploymentId: $deploymentId
        limit: $limit
        filter: $filter
        startDate: $startDate
        endDate: $endDate
      ) {
        timestamp
        message
        severity
      }
    }
  `
      : `
    query DeploymentLogs($deploymentId: String!, $limit: Int, $filter: String, $startDate: DateTime, $endDate: DateTime) {
      deploymentLogs(
        deploymentId: $deploymentId
        limit: $limit
        filter: $filter
        startDate: $startDate
        endDate: $endDate
      ) {
        timestamp
        message
        severity
      }
    }
  `;

  try {
    const result = await gql<{
      buildLogs?: DeploymentLog[];
      deploymentLogs?: DeploymentLog[];
    }>(query, {
      deploymentId,
      limit: options.limit ?? 100,
      filter: options.filter ?? null,
      startDate: options.startDate ?? null,
      endDate: options.endDate ?? null,
    });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    const logs =
      logType === 'build'
        ? result.data?.buildLogs ?? []
        : result.data?.deploymentLogs ?? [];

    return ok(logs);
  } catch (err) {
    return fail(err);
  }
}

// ─── 4. Get Recent Deployments ────────────────────────────────────────────────

/**
 * List recent deployments for a project (optionally filtered by service/environment).
 */
export async function getDeployments(
  projectId: string,
  limit = 10,
  options: {
    serviceId?: string;
    environmentId?: string;
  } = {}
): Promise<RailwayApiResponse<Deployment[]>> {
  const query = `
    query Deployments($input: DeploymentListInput!, $first: Int) {
      deployments(input: $input, first: $first) {
        edges {
          node {
            id
            status
            createdAt
            updatedAt
            url
            staticUrl
            serviceId
            environmentId
            projectId
            canRedeploy
            canRollback
            deploymentStopped
          }
        }
      }
    }
  `;

  try {
    const result = await gql<{
      deployments: { edges: Array<{ node: Deployment }> };
    }>(query, {
      input: {
        projectId,
        serviceId: options.serviceId ?? null,
        environmentId: options.environmentId ?? null,
      },
      first: limit,
    });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    const deployments =
      result.data?.deployments.edges.map((e) => e.node) ?? [];
    return ok(deployments);
  } catch (err) {
    return fail(err);
  }
}

// ─── 5. Get Deployment Status ─────────────────────────────────────────────────

/**
 * Check the status of a specific deployment.
 * Returns whether it succeeded, failed, is still running, etc.
 */
export async function getDeploymentStatus(
  _projectId: string,
  deploymentId: string
): Promise<
  RailwayApiResponse<{
    id: string;
    status: DeploymentStatus;
    succeeded: boolean;
    failed: boolean;
    inProgress: boolean;
    url?: string;
    createdAt: string;
    updatedAt: string;
  }>
> {
  const query = `
    query Deployment($id: String!) {
      deployment(id: $id) {
        id
        status
        url
        staticUrl
        createdAt
        updatedAt
        canRedeploy
        deploymentStopped
      }
    }
  `;

  const IN_PROGRESS_STATUSES: DeploymentStatus[] = [
    'BUILDING',
    'DEPLOYING',
    'INITIALIZING',
    'QUEUED',
    'WAITING',
    'NEEDS_APPROVAL',
  ];

  const FAILED_STATUSES: DeploymentStatus[] = [
    'CRASHED',
    'FAILED',
    'REMOVED',
    'REMOVING',
  ];

  try {
    const result = await gql<{
      deployment: Pick<
        Deployment,
        'id' | 'status' | 'url' | 'staticUrl' | 'createdAt' | 'updatedAt' | 'canRedeploy' | 'deploymentStopped'
      >;
    }>(query, { id: deploymentId });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    const d = result.data?.deployment;
    if (!d) return fail('Deployment not found');

    return ok({
      id: d.id,
      status: d.status,
      succeeded: d.status === 'SUCCESS',
      failed: FAILED_STATUSES.includes(d.status),
      inProgress: IN_PROGRESS_STATUSES.includes(d.status),
      url: d.url ?? d.staticUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  } catch (err) {
    return fail(err);
  }
}

// ─── 6. Trigger Redeploy ──────────────────────────────────────────────────────

/**
 * Force a new deployment.
 *
 * Two strategies:
 * - deploymentId: redeploy a specific past deployment (recommended when you
 *   have a known good deployment to re-run).
 * - serviceId + environmentId: trigger via serviceInstanceRedeploy (redeploys
 *   the latest commit on the service).
 *
 * At least one of (deploymentId) or (serviceId + environmentId) must be provided.
 */
export async function triggerRedeploy(
  _projectId: string,
  options:
    | { deploymentId: string }
    | { serviceId: string; environmentId: string }
): Promise<RailwayApiResponse<{ deploymentId?: string; success: boolean }>> {
  if ('deploymentId' in options) {
    // Redeploy a specific past deployment
    const mutation = `
      mutation DeploymentRedeploy($id: String!) {
        deploymentRedeploy(id: $id) {
          id
          status
        }
      }
    `;

    try {
      const result = await gql<{
        deploymentRedeploy: { id: string; status: DeploymentStatus };
      }>(mutation, { id: options.deploymentId });

      if (result.errors?.length) {
        return fail(result.errors.map((e) => e.message).join('; '));
      }

      return ok({
        deploymentId: result.data?.deploymentRedeploy.id,
        success: true,
      });
    } catch (err) {
      return fail(err);
    }
  } else {
    // Trigger via service instance redeploy
    const mutation = `
      mutation ServiceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
        serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
      }
    `;

    try {
      const result = await gql<{ serviceInstanceRedeploy: boolean }>(mutation, {
        serviceId: options.serviceId,
        environmentId: options.environmentId,
      });

      if (result.errors?.length) {
        return fail(result.errors.map((e) => e.message).join('; '));
      }

      return ok({
        success: result.data?.serviceInstanceRedeploy ?? false,
      });
    } catch (err) {
      return fail(err);
    }
  }
}

// ─── 7. Get Service Status ────────────────────────────────────────────────────

/**
 * Check whether a service is up or down by inspecting its latest deployment.
 * Requires serviceId + environmentId to look up the ServiceInstance.
 */
export async function getServiceStatus(
  _projectId: string,
  options: {
    serviceId: string;
    environmentId: string;
  }
): Promise<RailwayApiResponse<ServiceStatus>> {
  const query = `
    query ServiceInstance($serviceId: String!, $environmentId: String!) {
      serviceInstance(serviceId: $serviceId, environmentId: $environmentId) {
        id
        serviceId
        serviceName
        environmentId
        latestDeployment {
          id
          status
          url
          staticUrl
          updatedAt
        }
      }
    }
  `;

  try {
    const result = await gql<{ serviceInstance: ServiceInstance }>(query, {
      serviceId: options.serviceId,
      environmentId: options.environmentId,
    });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    const si = result.data?.serviceInstance;
    if (!si) return fail('Service instance not found');

    const latestStatus = si.latestDeployment?.status;
    const isUp = latestStatus === 'SUCCESS';

    return ok({
      serviceId: si.serviceId,
      serviceName: si.serviceName,
      isUp,
      latestDeploymentStatus: latestStatus,
      latestDeploymentId: si.latestDeployment?.id,
      deployedAt: si.latestDeployment?.updatedAt,
      url:
        (si.latestDeployment as unknown as { url?: string; staticUrl?: string })
          ?.url ??
        (si.latestDeployment as unknown as { url?: string; staticUrl?: string })
          ?.staticUrl,
    });
  } catch (err) {
    return fail(err);
  }
}

// ─── Convenience: Get project with environments + services ────────────────────

/**
 * Fetch project metadata including environments and services.
 * Useful for discovering IDs needed by the other functions.
 */
export async function getProject(projectId: string): Promise<
  RailwayApiResponse<{
    id: string;
    name: string;
    environments: Array<{ id: string; name: string }>;
    services: Array<{ id: string; name: string }>;
  }>
> {
  const query = `
    query Project($id: String!) {
      project(id: $id) {
        id
        name
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
        services {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await gql<{
      project: {
        id: string;
        name: string;
        environments: { edges: Array<{ node: { id: string; name: string } }> };
        services: { edges: Array<{ node: { id: string; name: string } }> };
      };
    }>(query, { id: projectId });

    if (result.errors?.length) {
      return fail(result.errors.map((e) => e.message).join('; '));
    }

    const p = result.data?.project;
    if (!p) return fail('Project not found');

    return ok({
      id: p.id,
      name: p.name,
      environments: p.environments.edges.map((e) => e.node),
      services: p.services.edges.map((e) => e.node),
    });
  } catch (err) {
    return fail(err);
  }
}
