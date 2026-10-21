tailwind.config = {
    theme: {
        extend: {
            colors: { primary: "#bb86fc", accent: "#03dac6" },
            fontFamily: {
                display: ['"Bebas Neue"', "cursive"],
                sans: ['"Rajdhani"', "sans-serif"],
            },
        },
    },
};

// ── Eliminar intro screen al terminar animación ──
const introScreen = document.getElementById('intro-screen');
if (introScreen) {
    // La animación dura 0.5s y empieza a 1.4s → termina a 1.9s
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1950);
}

// ── Nav mobile toggle ──
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('hidden');
});

// ── Sidebar toggle ──
const sidebar = document.querySelector('.gz-sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const toggleIcon = document.getElementById('sidebarToggleIcon');

function setSidebar(collapsed) {
    if (collapsed) {
        sidebar.classList.add('sidebar-collapsed');
        toggleBtn.classList.add('btn-collapsed');
        toggleIcon.className = 'bi bi-layout-sidebar-reverse';
        localStorage.setItem('sidebarCollapsed', '1');
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        toggleBtn.classList.remove('btn-collapsed');
        toggleIcon.className = 'bi bi-layout-sidebar';
        localStorage.setItem('sidebarCollapsed', '0');
    }
}

// Restore state from last session
if (localStorage.getItem('sidebarCollapsed') === '1') {
    setSidebar(true);
}

toggleBtn.addEventListener('click', () => {
    setSidebar(!sidebar.classList.contains('sidebar-collapsed'));
});

// ── Game Search Filter ──
const searchInput = document.getElementById('gameSearch');
const searchCount = document.getElementById('searchCount');

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const slots = document.querySelectorAll('.game-grid > div');
        let visible = 0;

        slots.forEach(slot => {
            // h3 = título, span con rounded-full = categoría, p.gcard-desc = descripción
            const title = slot.querySelector('h3')?.textContent.toLowerCase() || '';
            const cat = slot.querySelector('span.rounded-full')?.textContent.toLowerCase() || '';
            const desc = slot.querySelector('p.gcard-desc')?.textContent.toLowerCase() || '';
            const match = title.includes(query) || cat.includes(query) || desc.includes(query);

            if (query === '' || match) {
                slot.classList.remove('slot-hidden');
                visible++;
            } else {
                slot.classList.add('slot-hidden');
            }
        });

        if (searchCount) {
            if (query === '') {
                searchCount.textContent = '';
            } else {
                searchCount.textContent = visible === 0
                    ? 'Sin resultados'
                    : visible === 1 ? '1 juego encontrado' : visible + ' juegos encontrados';
            }
        }

        // no-results row
        let noRes = document.querySelector('.no-results');
        if (visible === 0 && query !== '') {
            if (!noRes) {
                noRes = document.createElement('div');
                noRes.className = 'no-results';
                noRes.innerHTML = '<i class="bi bi-controller"></i><p>Ningún juego coincide con "<strong style="color:#bb86fc">' + searchInput.value + '</strong>"</p>';
                document.querySelector('.game-grid').appendChild(noRes);
            } else {
                noRes.querySelector('p').innerHTML = 'Ningún juego coincide con "<strong style="color:#bb86fc">' + searchInput.value + '</strong>"';
            }
            noRes.style.display = 'flex';
        } else if (noRes) {
            noRes.style.display = 'none';
        }
    });
}