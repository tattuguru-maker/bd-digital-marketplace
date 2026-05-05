export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  // Since we're using client-side localStorage, the API feed serves as a
  // documentation endpoint. In production, this would query a real database.
  // For the MVP, clients should use the CSV export or the browser-based UI.

  const response = {
    service: "BCC EIP Cohort Identification System",
    version: "1.0.0",
    description: "Read-only feed for downstream tools to consume cohort run results",
    endpoints: {
      feed: {
        method: "GET",
        path: "/eip/api/feed",
        params: {
          runId: "Filter by specific run ID (optional)",
        },
      },
    },
    note: runId
      ? `Requested run: ${runId}. In production, this would return the full run data from the database.`
      : "Pass ?runId=RUN-XXXXXXXX-XXX to retrieve a specific cohort run result.",
    schema: {
      run: {
        id: "string (UUID)",
        runId: "string (RUN-YYYYMMDD-NNN)",
        criteriaSetId: "string (UUID)",
        criteriaVersion: "number",
        criteriaName: "string",
        timestamp: "string (ISO 8601)",
        inputSnapshot: {
          sourceIds: "string[]",
          sourceNames: "string[]",
          totalRows: "number",
          snapshotHash: "string",
        },
        resultCount: "number",
        subjects: [
          {
            id: "string",
            name: "string",
            contactDetail: "string",
            contactType: "email | phone | address | other",
            matchedFields: "Record<string, unknown>",
          },
        ],
        status: "completed | failed | running",
      },
    },
  };

  return Response.json(response, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "no-store",
    },
  });
}
