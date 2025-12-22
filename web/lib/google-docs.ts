import { google, docs_v1 } from 'googleapis';
import { setCredentials, GoogleTokens } from './google-auth';

/**
 * Create a new Google Doc
 */
export async function createDoc(
  tokens: GoogleTokens,
  title: string
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const response = await docs.documents.create({
    requestBody: {
      title: title,
    },
  });

  return response.data;
}

/**
 * Read content from a Google Doc
 */
export async function readDoc(
  tokens: GoogleTokens,
  documentId: string
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const response = await docs.documents.get({
    documentId: documentId,
  });

  return response.data;
}

/**
 * Insert text into a Google Doc
 */
export async function insertText(
  tokens: GoogleTokens,
  documentId: string,
  text: string,
  index: number = 1 // Index 1 is the start of the document
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const requests: docs_v1.Schema$Request[] = [
    {
      insertText: {
        location: {
          index: index,
        },
        text: text,
      },
    },
  ];

  const response = await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: requests,
    },
  });

  return response.data;
}

/**
 * Replace text in a Google Doc
 */
export async function replaceText(
  tokens: GoogleTokens,
  documentId: string,
  searchText: string,
  replacementText: string
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const requests: docs_v1.Schema$Request[] = [
    {
      replaceAllText: {
        containsText: {
          text: searchText,
          matchCase: false,
        },
        replaceText: replacementText,
      },
    },
  ];

  const response = await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: requests,
    },
  });

  return response.data;
}

/**
 * Format text in a Google Doc
 */
export async function formatText(
  tokens: GoogleTokens,
  documentId: string,
  startIndex: number,
  endIndex: number,
  format: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    foregroundColor?: { red: number; green: number; blue: number };
  }
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const textStyle: docs_v1.Schema$TextStyle = {};

  if (format.bold !== undefined) textStyle.bold = format.bold;
  if (format.italic !== undefined) textStyle.italic = format.italic;
  if (format.fontSize) {
    textStyle.fontSize = {
      magnitude: format.fontSize,
      unit: 'PT',
    };
  }
  if (format.foregroundColor) {
    textStyle.foregroundColor = {
      color: {
        rgbColor: format.foregroundColor,
      },
    };
  }

  const requests: docs_v1.Schema$Request[] = [
    {
      updateTextStyle: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
        textStyle: textStyle,
        fields: Object.keys(textStyle).join(','),
      },
    },
  ];

  const response = await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: requests,
    },
  });

  return response.data;
}

/**
 * Create a contract document from template
 */
export async function createContractDoc(
  tokens: GoogleTokens,
  clientName: string,
  serviceName: string,
  contractDetails: {
    date: string;
    amount: string;
    duration: string;
    terms: string[];
  }
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  // Create the document
  const title = `Contrat - ${clientName} - ${serviceName}`;
  const document = await createDoc(tokens, title);
  const documentId = document.documentId!;

  // Prepare content
  const content = `
CONTRAT DE SERVICES PROFESSIONNELS

Entre :
Sygma Consult
Paris, France / Tunis, Tunisie

Et :
${clientName}

Date : ${contractDetails.date}

Objet du Contrat : ${serviceName}
Montant : ${contractDetails.amount}
Durée : ${contractDetails.duration}

Termes et Conditions :
${contractDetails.terms.map((term, i) => `${i + 1}. ${term}`).join('\n')}

Fait à Paris/Tunis, le ${contractDetails.date}

______________________          ______________________
Sygma Consult                   ${clientName}
`;

  // Insert content
  await insertText(tokens, documentId, content, 1);

  // Format title
  await formatText(tokens, documentId, 1, 36, {
    bold: true,
    fontSize: 16,
    foregroundColor: { red: 0.0, green: 0.12, blue: 0.25 }, // #001F3F
  });

  return {
    documentId: documentId,
    title: title,
    webViewLink: document.documentUrl,
  };
}

/**
 * Export document as PDF
 */
export async function exportDocAsPdf(
  tokens: GoogleTokens,
  documentId: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.files.export(
    {
      fileId: documentId,
      mimeType: 'application/pdf',
    },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

/**
 * Get plain text content from document
 */
export async function getDocText(
  tokens: GoogleTokens,
  documentId: string
): Promise<string> {
  const doc = await readDoc(tokens, documentId);

  let text = '';

  if (doc.body?.content) {
    for (const element of doc.body.content) {
      if (element.paragraph?.elements) {
        for (const paragraphElement of element.paragraph.elements) {
          if (paragraphElement.textRun?.content) {
            text += paragraphElement.textRun.content;
          }
        }
      }
    }
  }

  return text;
}

/**
 * Add image to document
 */
export async function insertImage(
  tokens: GoogleTokens,
  documentId: string,
  imageUri: string,
  index: number = 1
) {
  const oauth2Client = setCredentials(tokens);
  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  const requests: docs_v1.Schema$Request[] = [
    {
      insertInlineImage: {
        location: {
          index: index,
        },
        uri: imageUri,
        objectSize: {
          height: {
            magnitude: 200,
            unit: 'PT',
          },
          width: {
            magnitude: 200,
            unit: 'PT',
          },
        },
      },
    },
  ];

  const response = await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: requests,
    },
  });

  return response.data;
}
