class todo {
    constructor({ lista_el, tekst_el, data_el, wyszukaj_el, storageKey = "zadanie_todo" }) {
        this.lista_el = lista_el;
        this.tekst_el = tekst_el;
        this.data_el = data_el;
        this.wyszukaj_el = wyszukaj_el;
        this.storageKey = storageKey;

        this.tasks = this.load();

        this.termin_el = "";
        this.id_tymczasowe = null;
        this._click_out = (ev) => this.gdy_przycisk_poza(ev);

        this.lista_el.addEventListener("click", (e) => this.gdy_przycisk_na_lista(e));
        this.wyszukaj_el.addEventListener("input", () => {
            const wartosc = this.wyszukaj_el.value.trim();
            this.termin_el = wartosc.length >= 2 ? wartosc : "";
            this.draw();
        });

        this.draw();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
        } catch (e) {
            console.error("blad zapisu localStorage", e);
        }
    }
    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("blad odczytu", e);
            return [];
        }
    }

    draw() {
        this.lista_el.innerHTML = "";
        const x = this.filteredtasks;

        for (const t of x) {
            const linia = document.createElement("li");
            linia.className = "element_todo";
            linia.dataset.id = t.id;

            const Html_string = this.termin_el.length >= 2
                ? this.highlight(t.text, this.termin_el)
                : this.escape(t.text);

            const Html_date = t.date
                ? ` <span class="element_data">(${
                    this.termin_el.length >= 2
                        ? this.highlight(t.date, this.termin_el)
                        : this.escape(t.date)
                })</span>`
                : "";

            linia.innerHTML = `
        <div class="todo_main" data-role="editable-area">
          <span class="element_text">${Html_string}</span>${Html_date}
        </div>
        <div class="controls">
          <button class="btn-small btn-danger" data-action="remove">Usuń</button>
        </div>
      `;

            if (this.id_tymczasowe === t.id) {
                this.edytor_w_liscie(linia, t);
            }

            this.lista_el.appendChild(linia);
        }
    }

    get filteredtasks() {
        const tekst = this.termin_el.toLowerCase();
        if (!tekst) return this.tasks;
        return this.tasks.filter(t =>
            t.text.toLowerCase().includes(tekst) ||
            (t.date || "").toLowerCase().includes(tekst)
        );
    }

    dodaj_zadanie(text, date = "") {
        if (!this.sprawdzanie_poprawnosci(text, date)) return;
        this.tasks.push({
            id: crypto.randomUUID(),
            text: text.trim(),
            date,
        });
        this.save();
        this.draw();
    }

    highlight(t, q) {
        const esq_q = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(${esq_q})`, "gi");
        return this.escape(t).replace(re, '<span class="highlight">$1</span>');
    }
    escape(s) {
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
    escapeAttr(s) {
        return this.escape(String(s)).replaceAll("\n", " ");
    }

    edytor_w_liscie(linia, task) {
        linia.classList.add("editing");

        const editor = document.createElement("div");
        editor.className = "inline-editor";
        editor.innerHTML = `
      <input class="edit-text" type="text" value="${this.escapeAttr(task.text)}" maxlength="255" />
      <input class="edit-date" type="date" value="${this.escapeAttr(task.date || "")}" />
    `;

        const main = linia.querySelector(".todo_main");
        main.replaceWith(editor);

        const inputText = editor.querySelector(".edit-text");
        const inputDate = editor.querySelector(".edit-date");

        inputText.focus();
        inputText.setSelectionRange(inputText.value.length, inputText.value.length);

        const onKeyDown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.potwierdz_edytor_w_liscie(task.id, inputText.value, inputDate.value);
            } else if (e.key === "Escape") {
                e.preventDefault();
                this.anuluj_edytor_w_liscie();
            }
        };
        inputText.addEventListener("keydown", onKeyDown);
        inputDate.addEventListener("keydown", onKeyDown);

        this.sprawdz_przycisk_poza_start(linia, task);
    }

    potwierdz_edytor_w_liscie(id, tekst, data) {
        if (!this.sprawdzanie_poprawnosci(tekst, data)) return;
        this.sprawdz_przycisk_poza_stop();
        this.id_tymczasowe = null;
        this.edytuj(id, tekst, data);
    }

    anuluj_edytor_w_liscie() {
        this.sprawdz_przycisk_poza_stop();
        this.edytowane_id = null;
        this.draw();
    }

    sprawdz_przycisk_poza_start(linia, zadanie) {
        this.sprawdz_przycisk_poza_stop();
        this.edytowany_element = linia;
        this.edytowane_id = zadanie.id;
        document.addEventListener("mousedown", this._click_out, true);
    }
    sprawdz_przycisk_poza_stop() {
        document.removeEventListener("mousedown", this._click_out, true);
        this.edytowany_element = null;
        this.edytowane_id = null;
    }

    sprawdzanie_poprawnosci(tresc_zadania, data_zadania) {
        const edytowany_tekst = (tresc_zadania ?? "").trim();

        if (edytowany_tekst.length < 3) {
            alert("minimum 3 znaki");
            return false;
        }
        if (edytowany_tekst.length > 255) {
            alert("maksimum 255 znaków");
            return false;
        }
        if (!data_zadania) { return true; }

        const teraz = new Date(); teraz.setHours(0, 0, 0, 0);
        const data_wpisania = new Date(data_zadania + "T00:00:00");

        if (data_wpisania < teraz) {
            alert("data nie w przeszłości");
            return false;
        }
        return true;
    }

    edytuj(id, tekst, data) {
        const t = this.tasks.find(t => t.id === id);
        if (!t) return;
        if (!this.sprawdzanie_poprawnosci(tekst, data)) return;
        t.text = tekst.trim();
        t.date = data.trim();
        this.save();
        this.draw();
    }

    gdy_przycisk_poza(ev) {
        if (!this.edytowany_element) return;
        if (!this.edytowany_element.contains(ev.target)) {
            const textEL = this.edytowany_element.querySelector(".edit-text");
            const dateEL = this.edytowany_element.querySelector(".edit-date");
            this.potwierdz_edytor_w_liscie(
                this.edytowane_id,
                textEL?.value ?? "",
                dateEL?.value ?? ""
            );
        }
    }

    gdy_przycisk_na_lista(e) {
        const przycisk = e.target.closest("button[data-action]");
        if (przycisk) {
            const li = przycisk.closest(".element_todo");
            if (!li) return;
            const id = li.dataset.id;
            const akcja = przycisk.dataset.action;
            if (akcja === "remove") return this.usun(id);
            return;
        }

        const obszar_edycji = e.target.closest("[data-role='editable-area'], .element_text, .element_data, .todo_main");
        const rzad = e.target.closest(".element_todo");
        if (obszar_edycji && rzad) {
            const id = rzad.dataset.id;
            this.edytor_w_liscie_wlacz(id);
        }
    }

    usun(id) {
        if (this.id_tymczasowe === id) this.sprawdz_przycisk_poza_stop();
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.draw();
    }

    edytor_w_liscie_wlacz(id) {
        if (this.id_tymczasowe === id) return;
        this.id_tymczasowe = id;
        this.draw();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const lista_el = document.getElementById("element_lista");
    const tekst_el = document.getElementById("tresc_zadanie");
    const data_el = document.getElementById("data_zadanie");
    const wyszukaj_el = document.getElementById("wyszukiwarka");

    const ToDo = new todo({
        lista_el,
        tekst_el,
        data_el,
        wyszukaj_el,
        storageKey: "zadanie_todo"
    });

    const nowy_element = document.getElementById("formulaz");
    nowy_element.addEventListener("submit", (e) => {
        e.preventDefault();                 // ważne, by nie przeładowywać strony
        const tresc_zadania = tekst_el.value.trim();
        const data_zadania = data_el.value;
        ToDo.dodaj_zadanie(tresc_zadania, data_zadania);
        nowy_element.reset();
        tekst_el.focus();
    });
});
