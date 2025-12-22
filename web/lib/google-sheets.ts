import { google, sheets_v4 } from 'googleapis';
import { setCredentials, GoogleTokens } from './google-auth';

/**
 * Create a new Google Sheet
 */
export async function createSheet(
  tokens: GoogleTokens,
  title: string,
  sheetTitles?: string[]
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const resource: sheets_v4.Schema$Spreadsheet = {
    properties: {
      title: title,
    },
    sheets: sheetTitles?.map(sheetTitle => ({
      properties: {
        title: sheetTitle,
      },
    })),
  };

  const response = await sheets.spreadsheets.create({
    requestBody: resource,
  });

  return response.data;
}

/**
 * Read data from a Google Sheet
 */
export async function readSheet(
  tokens: GoogleTokens,
  spreadsheetId: string,
  range: string
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });

  return response.data.values || [];
}

/**
 * Write data to a Google Sheet
 */
export async function writeToSheet(
  tokens: GoogleTokens,
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: values,
    },
  });

  return response.data;
}

/**
 * Append data to a Google Sheet
 */
export async function appendToSheet(
  tokens: GoogleTokens,
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: values,
    },
  });

  return response.data;
}

/**
 * Clear data from a Google Sheet
 */
export async function clearSheet(
  tokens: GoogleTokens,
  spreadsheetId: string,
  range: string
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.values.clear({
    spreadsheetId: spreadsheetId,
    range: range,
  });

  return response.data;
}

/**
 * Create a new sheet tab within an existing spreadsheet
 */
export async function addSheetTab(
  tokens: GoogleTokens,
  spreadsheetId: string,
  sheetTitle: string
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetTitle,
            },
          },
        },
      ],
    },
  });

  return response.data;
}

/**
 * Format cells in a Google Sheet
 */
export async function formatCells(
  tokens: GoogleTokens,
  spreadsheetId: string,
  sheetId: number,
  startRowIndex: number,
  endRowIndex: number,
  startColumnIndex: number,
  endColumnIndex: number,
  format: {
    backgroundColor?: { red: number; green: number; blue: number; alpha?: number };
    textFormat?: {
      bold?: boolean;
      fontSize?: number;
      foregroundColor?: { red: number; green: number; blue: number; alpha?: number };
    };
    horizontalAlignment?: 'LEFT' | 'CENTER' | 'RIGHT';
  }
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: startRowIndex,
              endRowIndex: endRowIndex,
              startColumnIndex: startColumnIndex,
              endColumnIndex: endColumnIndex,
            },
            cell: {
              userEnteredFormat: format,
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
      ],
    },
  });

  return response.data;
}

/**
 * Get spreadsheet metadata
 */
export async function getSpreadsheetInfo(
  tokens: GoogleTokens,
  spreadsheetId: string
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  });

  return response.data;
}

/**
 * Export bookings to Google Sheets
 */
export async function exportBookingsToSheet(
  tokens: GoogleTokens,
  spreadsheetId: string,
  bookings: any[]
) {
  const oauth2Client = setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  // Prepare headers
  const headers = [
    ['ID', 'Client Name', 'Email', 'Service', 'Date', 'Time', 'Status', 'Notes'],
  ];

  // Prepare data rows
  const rows = bookings.map(booking => [
    booking.id,
    booking.clientName,
    booking.email,
    booking.service,
    booking.date,
    booking.time,
    booking.status,
    booking.notes || '',
  ]);

  const allData = [...headers, ...rows];

  // Write to sheet
  await writeToSheet(tokens, spreadsheetId, 'A1', allData);

  // Format header row
  const spreadsheetInfo = await getSpreadsheetInfo(tokens, spreadsheetId);
  const sheetId = spreadsheetInfo.sheets?.[0]?.properties?.sheetId || 0;

  await formatCells(
    tokens,
    spreadsheetId,
    sheetId,
    0,
    1,
    0,
    8,
    {
      backgroundColor: { red: 0.0, green: 0.12, blue: 0.25 }, // #001F3F
      textFormat: {
        bold: true,
        foregroundColor: { red: 0.83, green: 0.69, blue: 0.22 }, // #D4AF37
        fontSize: 11,
      },
      horizontalAlignment: 'CENTER',
    }
  );

  return { rowsUpdated: allData.length };
}
