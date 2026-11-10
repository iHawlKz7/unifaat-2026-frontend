import taskRender from "./taskRender";
import { tasksListApi } from "../api/tasksListApi";

let currentTaskPage = 1;
export function getCurrentTaskPage(): number {
  return currentTaskPage;
}

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector<HTMLElement>('#tasks-container');
  if (!container) return;

  container.replaceChildren();
  const heading = document.createElement('h5');
  heading.innerText = 'Minhas tarefas';
  container.append(heading);

  try {
    const result = await tasksListApi({ page, limit: 10 });
    currentTaskPage = page;

    const ul = document.createElement('ul');
    ul.id = 'tasks-list';
    ul.classList.add('list-group');

    if (result.data.length === 0) {
      const empty = document.createElement('li');
      empty.classList.add('list-group-item', 'text-muted');
      empty.innerText = 'Nenhuma tarefa encontrada.';
      ul.append(empty);
    }

    result.data.forEach(task => ul.append(taskRender(task, idUser)));
    container.append(ul);

    const nav = document.createElement('nav');
    nav.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'mt-3');
    nav.setAttribute('aria-label', 'Paginação das tarefas');

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.classList.add('btn', 'btn-outline-primary');
    previous.innerText = 'Anterior';
    previous.disabled = page <= 1;
    previous.addEventListener('click', () => {
      void tasksListRender(idUser, page - 1);
    });

    const label = document.createElement('span');
    const lastPage = Math.max(1, Math.ceil(result.total / result.limit));
    label.innerText = `Página ${page} de ${lastPage}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.classList.add('btn', 'btn-outline-primary');
    next.innerText = 'Próxima';
    next.disabled = page >= lastPage;
    next.addEventListener('click', () => {
      void tasksListRender(idUser, page + 1);
    });

    nav.append(previous, label, next);
    container.append(nav);
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    const message = document.createElement('p');
    message.classList.add('alert', 'alert-danger');
    message.innerText = 'Não foi possível carregar as tarefas.';
    container.append(message);
  }
}
