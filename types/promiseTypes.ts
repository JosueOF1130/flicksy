export type DBSuccess = { success: true }
export type DBError = { success: false, error: string }
export type DBResult = DBSuccess | DBError;
