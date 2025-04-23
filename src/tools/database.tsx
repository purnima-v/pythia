import { memo } from 'react';
import { DatabaseToolProps, ToolResponse } from "../types/tool-types"

const baseDataUrl = process.env.baseDataUrl;



export async function executeQuery(query: string, operation: string, params?: any[]): Promise<any> {
    try {
        const response = await fetch(`http://localhost:3001/api/database/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, operation, params }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Query execution failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}


export const handleDatabaseQuery = async (query: string, operation: string, params?: string[]): Promise<ToolResponse> => {
    try {
      const response = await executeQuery(query, operation, params);
      return { success: true, output: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Database query failed';
      return { success: false, error: errorMessage };
    }
};
