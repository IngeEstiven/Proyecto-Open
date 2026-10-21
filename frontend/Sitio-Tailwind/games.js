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

// ── Nav toggle ──
document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navMenu").classList.toggle("hidden");
});

// ── Carousel ──
document.querySelectorAll(".gz-carousel").forEach((car) => {
    const slides = car.querySelectorAll(".gz-slide");
    const thumbs = car.querySelectorAll(".gz-thumb");
    const caption = car.querySelector(".gz-caption");
    const captions = Array.from(slides).map((s) => s.dataset.caption || "");
    let cur = 0;

    function go(n) {
        slides[cur].classList.add("hidden");
        thumbs[cur]?.classList.remove("ring-2", "ring-accent");
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.remove("hidden");
        thumbs[cur]?.classList.add("ring-2", "ring-accent");
        if (caption) caption.textContent = captions[cur];
    }

    car
        .querySelector(".gz-prev")
        ?.addEventListener("click", () => go(cur - 1));
    car
        .querySelector(".gz-next")
        ?.addEventListener("click", () => go(cur + 1));
    thumbs.forEach((t, i) => t.addEventListener("click", () => go(i)));

    // init
    slides.forEach((s, i) => {
        if (i !== 0) s.classList.add("hidden");
    });
    thumbs[0]?.classList.add("ring-2", "ring-accent");
    if (caption) caption.textContent = captions[0];
});

// ── Modal compra ──
document
    .getElementById("modal-overlay")
    ?.addEventListener("click", function (e) {
        if (e.target === this) window.location.hash = "close";
    });
