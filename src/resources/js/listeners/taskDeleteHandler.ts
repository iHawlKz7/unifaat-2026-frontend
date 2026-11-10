import tasksListRender, { getCurrentTaskPage } from "../render/tasksListRender";
import { taskDeleteApi } from "../api/taskDeleteApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskDeleteHandler(event: Event): Promise<void> {
  const li = (event.currentTarget as HTMLElement).closest('li') as TaskListItemElement | null;
  if (!li) return;

  try {
    await taskDeleteApi(li.taskId);
    await tasksListRender(li.userId, getCurrentTaskPage());
  } catch (error) {
    console.error(error);
    alert('Erro ao excluir tarefa');
  }
}
