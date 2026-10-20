import type { User } from "../types/api";

export default function userSearchResultsRender(
  container: HTMLElement,
  users: User[],
  total: number
): void {
  container.replaceChildren();

  const count = document.createElement("p");
  count.className = "small text-muted mb-2";
  count.textContent = `${total} ${total === 1 ? "usuário encontrado" : "usuários encontrados"}`;
  container.append(count);

  if (users.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-muted";
    empty.textContent = "Nenhum usuário encontrado";
    container.append(empty);
    return;
  }

  for (const user of users) {
    const card = document.createElement("div");
    card.className = "card mb-2";

    const body = document.createElement("div");
    body.className = "card-body d-flex justify-content-between align-items-center gap-3";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = user.name;

    const email = document.createElement("div");
    email.className = "small text-muted";
    email.textContent = user.email;

    const locationParts = [user.city, user.state].filter(
      (part): part is string => Boolean(part)
    );
    const profile = document.createElement("div");
    profile.className = "small";
    profile.textContent = `${user.job_title ?? "Cargo não informado"} · ${
      locationParts.join(" / ") || "Local não informado"
    }`;

    details.append(name, email, profile);

    const choose = document.createElement("button");
    choose.type = "button";
    choose.className = "btn btn-sm btn-outline-primary";
    choose.dataset.userId = String(user.id);
    choose.textContent = "Escolher";

    body.append(details, choose);
    card.append(body);
    container.append(card);
  }
}
