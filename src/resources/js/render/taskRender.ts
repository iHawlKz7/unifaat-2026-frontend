import type { Task } from "../types/api";
import type { TaskListItemElement } from "../types/dom";
import taskToggleHandler from "../listeners/taskToggleHandler";
import taskDeleteHandler from "../listeners/taskDeleteHandler";
import taskEditHandler from "../listeners/taskEditHandler";

export default function taskRender(task: Task, idUser: number): TaskListItemElement {
  const li = document.createElement('li') as TaskListItemElement;
  li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'gap-2');
  li.taskId = task.id;
  li.userId = idUser;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  checkbox.checked = task.is_done;
  checkbox.setAttribute('aria-label', `Concluir ${task.name}`);
  checkbox.addEventListener('change', taskToggleHandler);

  const name = document.createElement('span');
  name.classList.add('task-name', 'flex-grow-1');
  name.innerText = task.name;
  if (task.is_done) {
    name.classList.add('text-decoration-line-through', 'text-muted');
  }

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'task-edit');
  edit.innerText = 'Editar';
  edit.addEventListener('click', taskEditHandler);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.classList.add('btn', 'btn-danger', 'btn-sm');
  remove.innerText = 'Excluir';
  remove.addEventListener('click', taskDeleteHandler);

  li.append(checkbox, name, edit, remove);
  return li;
}
