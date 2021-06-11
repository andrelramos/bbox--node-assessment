import { CustomRequest } from "@utils/types";
import { Request, Response, Router } from "express";
import Project from "@src/projects/models/Project";
import { createProject, deleteProject, getAllProjects, getProjectByUUID } from "@projects/controllers";

interface ProjectRequestBody {
  userId: string;
  description: string;
}

const projectsRouter = Router();

projectsRouter.post(
  "/",
  async ({ body }: CustomRequest<ProjectRequestBody>, res: Response) => {
    const project: Project|null = await createProject({
      userId: body.userId,
      description: body.description,
    })
    if (project) res.status(201).json({ id: project.uuid });
    else res.status(404);
  }
);

projectsRouter.get("/", async (req: Request, res: Response) => {
  const userId: string = req.query.userId as string;
  let projects: Project[];

  if (userId) projects = await getAllProjects(userId);
  else projects = await getAllProjects();
  res.status(200).json(projects);
});

projectsRouter.get("/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project: Project|null = await getProjectByUUID(projectId);

  if (project) res.status(200).json(project);
  else res.status(404);
});

projectsRouter.delete("/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result: boolean = await deleteProject(projectId);
  if (result) res.sendStatus(204);
  else res.status(404).json({ message: "User not found!" });
});

export default projectsRouter;