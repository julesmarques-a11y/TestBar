// Notifications dans la page, à la place de alert() et confirm() :
//   showToast(message, options)   message en bas de l'écran, 4 s, avec éventuellement des boutons
//   confirmDialog(message, options) boîte de confirmation ; renvoie une promesse de true/false
//   showError(cible, message)     message d'erreur sous un bouton ou un champ, effacé à la saisie suivante
//   clearErrors()                 retire tous les messages d'erreur de la page
// À charger avant js/cart.js.
(function () {
    "use strict";

    const TOAST_DURATION = 4000;

    function toastContainer() {
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.className = "toast-container";
            container.setAttribute("aria-live", "polite");
            document.body.appendChild(container);
        }
        return container;
    }

    // options : { type: "info" | "success" | "error", duration: ms, actions: [{ label, href, primary, onClick }] }
    // Une action sans href ni onClick ferme simplement le message (« Continuer »).
    function showToast(message, options = {}) {
        const { type = "info", duration = TOAST_DURATION, actions = [] } = options;
        const container = toastContainer();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.setAttribute("role", type === "error" ? "alert" : "status");

        const text = document.createElement("span");
        text.className = "toast-message";
        text.textContent = message;
        toast.appendChild(text);

        let timer = null;
        const close = () => {
            clearTimeout(timer);
            toast.classList.add("toast-leaving");
            setTimeout(() => toast.remove(), 200);
        };
        const arm = () => { clearTimeout(timer); timer = setTimeout(close, duration); };

        if (actions.length) {
            const bar = document.createElement("div");
            bar.className = "toast-actions";
            actions.forEach(action => {
                const el = document.createElement(action.href ? "a" : "button");
                el.className = "btn " + (action.primary ? "btn-secondary" : "btn-neutral") + " toast-btn";
                el.textContent = action.label;
                if (action.href) el.href = action.href;
                else el.type = "button";
                el.addEventListener("click", () => {
                    if (typeof action.onClick === "function") action.onClick();
                    if (!action.href) close();
                });
                bar.appendChild(el);
            });
            toast.appendChild(bar);
        }

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "toast-close";
        closeBtn.setAttribute("aria-label", "Fermer");
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", close);
        toast.appendChild(closeBtn);

        // Le compte à rebours s'arrête tant que la souris est sur le message.
        toast.addEventListener("mouseenter", () => clearTimeout(timer));
        toast.addEventListener("mouseleave", arm);

        // Au plus trois messages à la fois : le plus ancien s'efface.
        while (container.children.length >= 3) container.firstElementChild.remove();
        container.appendChild(toast);
        arm();
        return toast;
    }

    // options : { okLabel, cancelLabel, title }
    function confirmDialog(message, options = {}) {
        const { okLabel = "Confirmer", cancelLabel = "Annuler", title = "" } = options;
        return new Promise(resolve => {
            const dialog = document.createElement("dialog");
            dialog.className = "confirm-dialog";
            dialog.innerHTML = `
                <form method="dialog" class="confirm-form">
                    ${title ? `<h2 class="confirm-title"></h2>` : ""}
                    <p class="confirm-message"></p>
                    <div class="confirm-actions">
                        <button type="submit" value="cancel" class="btn btn-neutral"></button>
                        <button type="submit" value="ok" class="btn btn-primary"></button>
                    </div>
                </form>`;
            if (title) dialog.querySelector(".confirm-title").textContent = title;
            dialog.querySelector(".confirm-message").textContent = message;
            dialog.querySelector('button[value="cancel"]').textContent = cancelLabel;
            dialog.querySelector('button[value="ok"]').textContent = okLabel;
            dialog.addEventListener("close", () => {
                const ok = dialog.returnValue === "ok";
                dialog.remove();
                resolve(ok);
            });
            document.body.appendChild(dialog);
            dialog.showModal();
            dialog.querySelector('button[value="ok"]').focus();
        });
    }

    // cible : élément ou id. Le message se place sous le groupe du champ (.control-group) ou sous
    // l'élément lui-même, et disparaît dès que l'on modifie le champ.
    function showError(target, message) {
        const el = typeof target === "string" ? document.getElementById(target) : target;
        if (!el) {
            showToast(message, { type: "error" });
            return null;
        }
        const anchor = el.closest(".control-group, .quantity-control") || el;
        let error = anchor.nextElementSibling;
        if (!(error && error.classList.contains("field-error"))) {
            error = document.createElement("p");
            error.className = "field-error";
            error.setAttribute("role", "alert");
            anchor.insertAdjacentElement("afterend", error);
        }
        error.textContent = message;

        const isField = /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
        if (isField) {
            el.setAttribute("aria-invalid", "true");
            const clear = () => { error.remove(); el.removeAttribute("aria-invalid"); };
            el.addEventListener("input", clear, { once: true });
            el.addEventListener("change", clear, { once: true });
            try { el.focus({ preventScroll: false }); } catch (e) { /* ignore */ }
        } else {
            error.scrollIntoView({ block: "nearest" });
        }
        return error;
    }

    function clearErrors(root = document) {
        root.querySelectorAll(".field-error").forEach(e => e.remove());
        root.querySelectorAll("[aria-invalid]").forEach(e => e.removeAttribute("aria-invalid"));
    }

    window.showToast = showToast;
    window.confirmDialog = confirmDialog;
    window.showError = showError;
    window.clearErrors = clearErrors;
})();
