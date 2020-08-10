
export interface MediaFile {
    filename: string
    mimetype: string,
    size: number,
    uploadedTime: Date
    status?: 'firebase' | 'firebase-local' | 'local'
    id: string
    downloadUrl?: string,
    downloadToken?: string,
    processed?: {
        localProcessedUrl?: string,
        localProcessedWaveform?: string,
        output?: string
    }
}