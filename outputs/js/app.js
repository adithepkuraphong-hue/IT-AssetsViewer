// ============================================================
// app.js — Entry point: render loop and boot
// ============================================================

function render() {
  applyAppPreferences();
  const app = document.getElementById("app");
  if (!state.user) {
    app.innerHTML = renderLogin();
    translateUi(app);
    bindLogin();
    return;
  }
  if (!routeAllowed(state.route)) state.route = "dashboard";

  let shell = app.querySelector(".app-shell");
  if (shell && shell.dataset.lang !== state.lang) {
    shell = null;
  }
  if (!shell) {
    app.innerHTML = renderShell();
  } else {
    // 1. Update Workspace class
    const workspace = shell.querySelector(".workspace");
    if (workspace) {
      workspace.className = `workspace ${state.sidebarCollapsed ? "sidebar-collapsed" : ""}`;

      // Update drawer backdrop
      let backdrop = workspace.querySelector(".drawer-backdrop");
      if (state.drawerOpen) {
        if (!backdrop) {
          workspace.insertAdjacentHTML("afterbegin", '<div class="drawer-backdrop" data-close-drawer></div>');
        }
      } else if (backdrop) {
        backdrop.remove();
      }
    }

    // 2. Update Sidebar drawer open class
    const sidebar = shell.querySelector(".sidebar");
    if (sidebar) {
      sidebar.className = `sidebar ${state.drawerOpen ? "open" : ""}`;
    }

    // 3. Update Nav
    const nav = shell.querySelector(".nav");
    if (nav) {
      refreshNav(nav);
    }

    // 4. Update Sidebar bottom
    const sidebarBottom = shell.querySelector(".sidebar-bottom");
    if (sidebarBottom) {
      const currentUser = registeredUsers().find(u => String(u.username).toLowerCase() === String(state.user?.username).toLowerCase()) || state.user || {};
      const userAvatar = currentUser.avatar || state.user?.avatar || "";
      const langStripHtml = `
      <div class="lang-strip" style="display:flex; ${state.sidebarCollapsed ? "justify-content:center" : "justify-content:space-between"}; align-items:center; padding:${state.sidebarCollapsed ? "10px 10px" : "10px 22px"}; border-top:1px solid rgba(255,255,255,.14)">
        ${state.sidebarCollapsed ? "" : `<span style="font-size:12px; font-weight:800; opacity:0.8; color:#fff">${t("ภาษา / Language", "Language")}</span>`}
        <div style="display:flex; gap:6px; align-items:center">
          <button class="lang-btn" data-set-lang="th" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'th' ? '1' : '0.5'}">TH</button>
          <span style="opacity:0.5; color:#fff; font-size:12px">|</span>
          <button class="lang-btn" data-set-lang="en" style="background:transparent; border:0; color:#fff; font-weight:bold; font-size:12px; cursor:pointer; opacity:${state.lang === 'en' ? '1' : '0.5'}">EN</button>
        </div>
      </div>
      `;
      sidebarBottom.innerHTML = `
        ${langStripHtml}
        <button class="sidebar-footer-btn" data-toggle-sidebar>${icon("checkout")}<span>${state.sidebarCollapsed ? t("ขยายเมนู", "Expand Menu") : t("ย่อเมนู", "Collapse Menu")}</span></button>
        <div class="user-strip">
          <span class="avatar" style="overflow:hidden; display:grid; place-items:center">${userAvatar ? `<img src="${esc(userAvatar)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%">` : icon("user")}</span>
          <div style="flex:1"><strong>${esc(state.user.name)}</strong><div class="role-pill">${esc(state.user.role)}</div></div>
          <button class="more-btn" data-logout title="Logout">${icon("logout")}</button>
        </div>
      `;
    }

    // 5. Update Content
    const content = shell.querySelector(".content");
    if (content) {
      content.className = `content ${state.route === "dashboard" ? "dashboard-content" : ""} route-${state.route}`;
      content.innerHTML = renderRoute();
    }

    // 6. Update badge count
    const unreadWarrantyNotifications = systemNotifications().filter(item => !item.read).length;
    const bellWrap = shell.querySelector(".bell-wrap");
    if (bellWrap) {
      const badge = bellWrap.querySelector(".badge-count");
      if (unreadWarrantyNotifications > 0) {
        if (badge) {
          badge.textContent = unreadWarrantyNotifications;
        } else {
          bellWrap.insertAdjacentHTML("beforeend", `<span class="badge-count">${unreadWarrantyNotifications}</span>`);
        }
      } else if (badge) {
        badge.remove();
      }
    }

    // 7. Update overlay containers
    const actionMenuContainer = document.getElementById("action-menu-container");
    if (actionMenuContainer) {
      actionMenuContainer.innerHTML = renderActionMenuOverlay();
    }

    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) {
      modalContainer.innerHTML = state.modal ? renderModal(state.modal) : "";
    }

    const lightboxContainer = document.getElementById("lightbox-container");
    if (lightboxContainer) {
      lightboxContainer.innerHTML = state.previewImageUrl ? renderLightbox(state.previewImageUrl) : "";
    }

    const toastContainer = document.getElementById("toast-container");
    if (toastContainer) {
      toastContainer.innerHTML = state.toast ? `<div class="toast">${icon("check")}<span>${esc(state.toast.message)}</span></div>` : "";
    }
  }
  translateUi(app);
  bindShell();
}

async function getClientIPv4() {
  // 1. Try public IPv4 only service to force IPv4 lookup
  try {
    const ipRes = await fetch("https://api4.ipify.org?format=json");
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.ip && !ipData.ip.includes(":")) {
        return ipData.ip;
      }
    }
  } catch (err) {
    console.warn("api4.ipify.org lookup failed:", err);
  }

  // 2. Try secondary public IPv4 only service
  try {
    const ipRes = await fetch("https://ipv4.icanhazip.com");
    if (ipRes.ok) {
      const text = await ipRes.text();
      const ip = text.trim();
      if (ip && !ip.includes(":")) {
        return ip;
      }
    }
  } catch (err) {
    console.warn("ipv4.icanhazip.com lookup failed:", err);
  }

  // 3. Fallback to server's IP resolver (which maps local addresses correctly)
  if (DATABASE_API_ENABLED) {
    try {
      const ipRes = await fetch("/api/ip");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        return ipData.ip;
      }
    } catch (err) {
      console.warn("Backend IP lookup failed:", err);
    }
  }

  return "127.0.0.1";
}

async function boot() {
  state.clientIp = await getClientIPv4();

  if (DATABASE_API_ENABLED) {
    await loadServerDatabase();
    window.setInterval(pollServerDatabase, 4000);
  }
  render();
}

boot();
