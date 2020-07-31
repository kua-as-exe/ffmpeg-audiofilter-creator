
export interface MediaFile {
    path: {
        name: string,
        base: string,
        ext: string,
        dir: string
    }
    mimetype: string,
    size: number,
    uploadedTime: Date
}