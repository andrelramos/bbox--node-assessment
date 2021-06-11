import { v4 as uuidv4 } from "uuid";
import { getUserByUUID } from "@users/controllers";
import User from "@src/users/models/User";
import Project from "@src/projects/models/Project";

interface projectData {
  userId: string,
  description: string,
}

export async function createProject(projectData: projectData): Promise<Project|null> {
  const uuid = uuidv4();
  const user: User = await getUserByUUID(projectData.userId);
  if (user) {
    const project: Project = Project.create({
      uuid,
      description: projectData.description,
      owner: user,
      creationDate: new Date(),
    });
    return await project.save(); 
  }
}

export async function getAllProjects(userId?: string): Promise<Project[]> {
  if (userId) return await Project.find({where: { owner: userId }});
  else return await Project.find();
}

export async function getProjectByUUID(projectId: string): Promise<Project|null> {
  const project: Project = await Project.findOne({
    where: { uuid: projectId },
  });

  return project;
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const project: Project|null = await getProjectByUUID(projectId);
  if (project) {
    await Project.delete(project);
    return true;
  }
  return false;
}