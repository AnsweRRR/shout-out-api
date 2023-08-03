import { CustomFile } from "src/components/upload";

export type Reward = {
    id?: number | null,
    name?: string | null,
    description?: string | null,
    cost?: number | null,
    avatar?: CustomFile | string | null
};