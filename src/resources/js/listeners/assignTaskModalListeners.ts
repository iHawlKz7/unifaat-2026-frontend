import { taskCreateApi } from "../api/taskCreateApi";
import { userSearchApi } from "../api/userSearchApi";
import userSearchResultsRender from "../render/userSearchResultsRender";
import type { User, UserSearchFilters } from "../types/api";
import { getUserId } from "../utils/getUserIdFromAuth";
import tasksListRender from "../render/tasksListRender";

type SearchTextField = "name" | "email" | "job_title" | "city" | "state" | "bio";

export default async function assignTaskModalListeners(idUser: number): Promise<void> {
  const form = document.querySelector<HTMLFormElement>("#assign-task-form");
  const taskNameInput = document.querySelector<HTMLInputElement>("#assign-task-name");
  const searchField = document.querySelector<HTMLSelectElement>("#assign-search-field");
  const searchValue = document.querySelector<HTMLInputElement>("#assign-search-value");
  const searchButton = document.querySelector<HTMLButtonElement>("#assign-search-btn");
  const resultsContainer = document.querySelector<HTMLDivElement>("#assign-search-results");
  const selectedContainer = document.querySelector<HTMLDivElement>("#assign-selected-user");
  const message = document.querySelector<HTMLDivElement>("#assign-task-message");
  const submitButton = document.querySelector<HTMLButtonElement>("#assign-task-submit");
  const cancelButton = document.querySelector<HTMLButtonElement>("#assign-task-cancel");

  if (
    !form ||
    !taskNameInput ||
    !searchField ||
    !searchValue ||
    !searchButton ||
    !resultsContainer ||
    !selectedContainer ||
    !message ||
    !submitButton
  ) {
    return;
  }

  let foundUsers: User[] = [];
  let selectedUser: User | null = null;

  const clearMessage = (): void => {
    message.textContent = "";
    message.className = "d-none mt-3";
  };

  const setMessage = (text: string, variant = "danger"): void => {
    message.textContent = text;
    message.className = `alert alert-${variant} mt-3`;
  };

  const updateSubmitButton = (): void => {
    submitButton.disabled = !taskNameInput.value.trim() || selectedUser === null;
  };

  const renderSelectedUser = (): void => {
    selectedContainer.replaceChildren();

    if (!selectedUser) {
      return;
    }

    const selected = document.createElement("p");
    selected.className = "alert alert-success mb-0";
    selected.textContent = `Atribuir para: ${selectedUser.name} (${selectedUser.email})`;
    selectedContainer.append(selected);
  };

  const searchUsers = async (): Promise<void> => {
    const term = searchValue.value.trim();

    selectedUser = null;
    renderSelectedUser();
    updateSubmitButton();
    clearMessage();

    if (!term) {
      foundUsers = [];
      resultsContainer.replaceChildren();
      setMessage("Digite algo para buscar.");
      return;
    }

    const field = searchField.value as SearchTextField;
    const filters: UserSearchFilters = {};

    if (field === "name") filters.name = term;
    if (field === "email") filters.email = term;
    if (field === "job_title") filters.job_title = term;
    if (field === "city") filters.city = term;
    if (field === "state") filters.state = term;
    if (field === "bio") filters.bio = term;

    resultsContainer.textContent = "Buscando...";
    foundUsers = [];

    try {
      const response = await userSearchApi(filters, 1, 10);
      foundUsers = response.data;
      userSearchResultsRender(resultsContainer, foundUsers, response.total);
    } catch (error) {
      resultsContainer.replaceChildren();
      const detail = error instanceof Error ? error.message : "Tente novamente.";
      setMessage(`Erro ao buscar usuários: ${detail}`);
    }
  };

  searchButton.addEventListener("click", () => {
    void searchUsers();
  });

  searchValue.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void searchUsers();
  });

  resultsContainer.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const chooseButton = event.target.closest<HTMLButtonElement>("[data-user-id]");

    if (!chooseButton) {
      return;
    }

    const userId = Number(chooseButton.dataset.userId);
    const user = foundUsers.find((item) => item.id === userId);

    if (!user) {
      return;
    }

    selectedUser = user;
    renderSelectedUser();
    updateSubmitButton();
    clearMessage();
  });

  taskNameInput.addEventListener("input", updateSubmitButton);

  form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const name = taskNameInput.value.trim();

    if (!name) {
      setMessage("Digite o nome da tarefa.");
      return;
    }

    if (!selectedUser) {
      setMessage("Busque e escolha um usuário antes de criar a tarefa.");
      return;
    }

    const assignedUser = selectedUser;
    const assignedToCurrentUser = assignedUser.id === getUserId();
    submitButton.disabled = true;
    clearMessage();

    try {
      await taskCreateApi(assignedUser.id, { name });

      if (assignedToCurrentUser) {
        await tasksListRender(idUser);
      }

      cancelButton?.click();
      form.reset();
      foundUsers = [];
      selectedUser = null;
      resultsContainer.replaceChildren();
      renderSelectedUser();
      updateSubmitButton();

      window.alert(`Tarefa criada para ${assignedUser.name}`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Tente novamente.";
      setMessage(`Erro ao criar a tarefa: ${detail}`);
      updateSubmitButton();
    }
  });
}
