
import { database } from "./firebase";

import { get, onValue, push, ref, set, update } from "firebase/database";

import type { ProjectDataType, ProjectsDataType } from "@/types/projectType";

type DBSuccess = { success: true };
type DBError = { success: false; errorMessage: string; };

type DBResult = DBSuccess | DBError;

export async function saveProject(uid: string, projectData: ProjectDataType): Promise<DBResult> {
    try {
        const projectsRef = ref(database, `users/${uid}/projects`);
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, { ...projectData, createdAt: Date.now() });
        return { success: true };
    } catch (error: any) {
        return ({
            success: false,
            errorMessage: error?.message ?? "Failed to save project",
        });
    }
}

export function listenToUserProjects(uid: string, callback: (result: ProjectsDataType[]) => void): () => void {

    const projectsRef = ref(database, `users/${uid}/projects`);
    const unsubcribeFromProjects = onValue(projectsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const projectsData = snapshot.val();


        const projects: ProjectsDataType[] = Object.keys(projectsData).map((key) => ({
            id: key,
            ...projectsData[key],
        }));

        callback(projects);
    });
    return unsubcribeFromProjects;
}



type GetProjectResultType = ProjectDataType | DBError | [];


export async function getProject(uid: string, projectId: string): Promise<GetProjectResultType> {
    try {

        const projectRef = ref(database, `users/${uid}/projects/${projectId}`);

        const snapshot = await get(projectRef);

        if (snapshot.exists()) {

            return snapshot.val();

        } else {

            return []

        }

    } catch (error: any) {

        return {

            success: false, 
            errorMessage: error?.message ?? "Failed to fetch project data"
        
        }

    }
}




export async function updateProject(uid: string, projectId: string, data: ProjectDataType): Promise<DBResult> {
    try {
        const projectRef = ref(database, `users/${uid}/projects/${projectId}`);
        await update(projectRef, data);
        return { success: true }
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error?.message ?? "Failed to update project. Try again"
        }
    }
}

