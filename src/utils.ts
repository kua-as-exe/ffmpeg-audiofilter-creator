import { readFileSync } from "fs";

export const getDataJSON = async (path: string) => JSON.parse(
     await readFileSync(path)
        .toString())