
import { PPTOutline } from "../types";

export const generatePPTOutline = async (topic: string): Promise<PPTOutline> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate presentation outline');
  }

  return await response.json();
};
