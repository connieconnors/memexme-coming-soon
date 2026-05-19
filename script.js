const form = document.querySelector("#signup-form");
const note = document.querySelector("#form-note");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const email = formData.get("email");

  note.textContent = `Thanks, ${email}. You are on the list.`;
  form.reset();
});
