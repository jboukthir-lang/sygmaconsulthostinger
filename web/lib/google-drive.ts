import { google, drive_v3 } from 'googleapis';
import { setCredentials, GoogleTokens } from './google-auth';
import { Readable } from 'stream';

/**
 * Upload file to Google Drive
 */
export async function uploadFileToDrive(
  tokens: GoogleTokens,
  file: {
    name: string;
    mimeType: string;
    buffer: Buffer;
    folderId?: string;
  }
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const fileMetadata: drive_v3.Schema$File = {
    name: file.name,
    parents: file.folderId ? [file.folderId] : undefined,
  };

  const media = {
    mimeType: file.mimeType,
    body: Readable.from(file.buffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink, thumbnailLink',
  });

  return response.data;
}

/**
 * Create a folder in Google Drive
 */
export async function createDriveFolder(
  tokens: GoogleTokens,
  folderName: string,
  parentFolderId?: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const fileMetadata: drive_v3.Schema$File = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  return response.data;
}

/**
 * List files in Google Drive
 */
export async function listDriveFiles(
  tokens: GoogleTokens,
  options?: {
    folderId?: string;
    pageSize?: number;
    query?: string;
  }
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  let query = options?.query || '';

  if (options?.folderId) {
    query = query ? `${query} and '${options.folderId}' in parents` : `'${options.folderId}' in parents`;
  }

  const response = await drive.files.list({
    q: query,
    pageSize: options?.pageSize || 10,
    fields: 'nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, webContentLink, thumbnailLink)',
  });

  return response.data.files || [];
}

/**
 * Download file from Google Drive
 */
export async function downloadDriveFile(
  tokens: GoogleTokens,
  fileId: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.files.get(
    {
      fileId: fileId,
      alt: 'media',
    },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

/**
 * Delete file from Google Drive
 */
export async function deleteDriveFile(
  tokens: GoogleTokens,
  fileId: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  await drive.files.delete({
    fileId: fileId,
  });

  return true;
}

/**
 * Share file or folder with specific users
 */
export async function shareDriveFile(
  tokens: GoogleTokens,
  fileId: string,
  emailAddress: string,
  role: 'reader' | 'writer' | 'commenter' = 'reader'
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      type: 'user',
      role: role,
      emailAddress: emailAddress,
    },
    sendNotificationEmail: true,
  });

  return response.data;
}

/**
 * Make file publicly accessible
 */
export async function makeFilePublic(
  tokens: GoogleTokens,
  fileId: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      type: 'anyone',
      role: 'reader',
    },
  });

  // Get the web view link
  const file = await drive.files.get({
    fileId: fileId,
    fields: 'webViewLink, webContentLink',
  });

  return {
    permission: response.data,
    webViewLink: file.data.webViewLink,
    webContentLink: file.data.webContentLink,
  };
}

/**
 * Search files in Drive
 */
export async function searchDriveFiles(
  tokens: GoogleTokens,
  searchQuery: string
) {
  const oauth2Client = setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.files.list({
    q: `name contains '${searchQuery}' and trashed=false`,
    pageSize: 20,
    fields: 'files(id, name, mimeType, createdTime, modifiedTime, webViewLink)',
  });

  return response.data.files || [];
}
