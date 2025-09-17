import { GoogleGenAI, Type } from "@google/genai";
import type { AiReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProjectReview(fileContent: string): Promise<AiReport> {
  const systemPrompt = `Act as a senior software architect and project manager. Your task is to analyze a daily project review document. Provide a comprehensive summary and analysis in JSON format to be used in a dashboard. The JSON schema must be followed precisely.`;

  const userQuery = `Analyze the following daily project review document and generate a dashboard report based on the requested JSON schema. Focus on summarizing key activities, identifying major changes or additions, and providing a list of tasks with their statuses. The document content is:\n\n${fileContent}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            "report_title": { "type": Type.STRING },
            "project_summary": { "type": Type.STRING },
            "project_health_status": {
              "type": Type.OBJECT,
              "properties": {
                "status_message": { "type": Type.STRING },
                "ci_cd_passed": { "type": Type.BOOLEAN },
                // FIX: Removed stray double quote at the end of Type.STRING
                "deployment_status": { "type": Type.STRING },
                // FIX: Removed stray double quote at the end of Type.STRING
                "last_deployed_branch": { "type": Type.STRING }
              },
               "required": ["status_message", "ci_cd_passed", "deployment_status", "last_deployed_branch"]
            },
            "key_metrics": {
              "type": Type.OBJECT,
              "properties": {
                "files_changed_today": { "type": Type.NUMBER },
                "total_commits": { "type": Type.NUMBER },
                "new_repositories": { "type": Type.NUMBER }
              },
               "required": ["files_changed_today", "total_commits", "new_repositories"]
            },
            "recent_activity_timeline": {
              "type": Type.ARRAY,
              "items": {
                "type": Type.OBJECT,
                "properties": {
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "type": { "type": Type.STRING },
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "description": { "type": Type.STRING },
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "timestamp": { "type": Type.STRING },
                  "details": {
                    "type": Type.OBJECT,
                    "properties": {
                      // FIX: Removed stray double quote at the end of Type.STRING
                      "branch": { "type": Type.STRING },
                      // FIX: Removed stray double quote at the end of Type.STRING
                      "status": { "type": Type.STRING }
                    }
                  }
                },
                "required": ["type", "description", "timestamp"]
              }
            },
            "kanban_tasks": {
              "type": Type.ARRAY,
              "items": {
                "type": Type.OBJECT,
                "properties": {
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "title": { "type": Type.STRING },
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "description": { "type": Type.STRING },
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "status": { "type": Type.STRING },
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "assignee": { "type": Type.STRING }
                },
                "required": ["title", "description", "status", "assignee"]
              }
            },
            "understanding_the_report": {
              "type": Type.OBJECT,
              "properties": {
                // FIX: Removed stray double quote at the end of Type.STRING
                "what_matters_summary": { "type": Type.STRING },
                "actionable_insights": {
                  "type": Type.ARRAY,
                  // FIX: Removed stray double quote at the end of Type.STRING
                  "items": { "type": Type.STRING }
                }
              },
              "required": ["what_matters_summary", "actionable_insights"]
            }
          },
          "required": [
            "report_title",
            "project_summary",
            "project_health_status",
            "key_metrics",
            "recent_activity_timeline",
            "kanban_tasks",
            "understanding_the_report"
          ]
        }
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("API returned an empty response.");
    }
    
    return JSON.parse(jsonText) as AiReport;

  } catch (error) {
    console.error('AI analysis error:', error);
    if (error instanceof Error) {
        throw new Error(`AI analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during AI analysis.');
  }
}