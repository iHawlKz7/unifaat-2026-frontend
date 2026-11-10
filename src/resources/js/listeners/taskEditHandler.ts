import { taskUpdateApi } from "../api/taskUpdateApi";
import tasksListRender, { getCurrentTaskPage } from "../render/tasksListRender";
import type { TaskListItemElement } from "../types/dom";

export default async function taskEditHandler(event: Event): Promise<void> {
  const button = event.currentTarget as HTMLButtonElement;
  const li = button.closest('li') as TaskListItemElement | null;
  if (!li) return;

  const input = li.querySelector<HTMLInputElement>('.task-edit-input');
  if (input) {
    const name = input.value.trim();
    if (!name) {
      alert('Digite o nome da tarefa');
      input.focus();
      return;
    }

    button.disabled = true;
    try {
      await taskUpdateApi(li.taskId, { name });
      await tasksListRender(li.userId, getCurrentTaskPage());
    } catch (error) {
      console.error(error);
      alert('Erro ao editar tarefa');
      button.disabled = false;
    }
    return;
  }

  const span = li.querySelector<HTMLSpanElement>('.task-name');
  if (!span) return;

  const editor = document.createElement('input');
  editor.type = 'text';
  editor.value = span.innerText;
  editor.classList.add('form-control', 'task-edit-input', 'flex-grow-1');
  editor.setAttribute('aria-label', 'Novo nome da tarefa');
  editor.addEventListener('keydown', eventKey => {
    if (eventKey.key === 'Enter') {
      button.click();
    }
    if (eventKey.key === 'Escape') {
      editor.replaceWith(span);
      button.innerText = 'Editar';
    }
  });
  span.replaceWith(editor);
  button.innerText = 'Salvar';
  editor.focus();
  editor.select();
}
