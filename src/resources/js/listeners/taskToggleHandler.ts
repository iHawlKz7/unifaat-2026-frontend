import tasksListRender, { getCurrentTaskPage } from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskToggleHandler(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const li = input.closest('li') as TaskListItemElement | null;
  if (!li) return;

  try {
    await taskUpdateApi(li.taskId, { is_done: input.checked });
    await tasksListRender(li.userId, getCurrentTaskPage());
  } catch (error) {
    console.error(error);
    input.checked = !input.checked;
    alert('Erro ao atualizar tarefa');
  }
}
