// register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sound Logic (Aggressive Autoplay) ---
    const audio = document.getElementById('background-music');
    const vinyl = document.getElementById('music-vinyl');
    let isPlaying = false;

    const playAudio = () => {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                if (vinyl) vinyl.classList.add('playing');
                // Remove listeners once playing
                ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'].forEach(evt =>
                    document.body.removeEventListener(evt, playAudio)
                );
            }).catch(err => {
                console.log("Browser blocked autoplay. Waiting for interaction.");
            });
        }
    };

    const toggleMusic = (e) => {
        if (e) e.stopPropagation();
        if (!isPlaying) {
            playAudio();
        } else {
            audio.pause();
            isPlaying = false;
            if (vinyl) vinyl.classList.remove('playing');
        }
    };

    if (vinyl) {
        vinyl.addEventListener('click', toggleMusic);
    }

    // 1. Try immediately
    playAudio();

    // 2. Catch ANY first interaction
    ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'].forEach(evt =>
        document.body.addEventListener(evt, playAudio, { capture: true, once: true })
    );

    // --- 2. Preloader Animation (GSAP) ---
    const tl = gsap.timeline({
        onComplete: () => {
            initScrollAnimations();
        }
    });

    tl.to(".couple-initials-loader", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(".loader-line", { width: "60px", duration: 0.8, ease: "power2.inOut" })
        .to(".preloader-title", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(".preloader-subtitle", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.2")
        .to("#preloader", {
            opacity: 0,
            duration: 1,
            pointerEvents: "none",
            delay: 1.5
        });


    // --- 3. Swiper Gallery ---
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        cardsEffect: {
            perSlideOffset: 8,
            perSlideRotate: 2,
            slideShadows: true,
        },
        initialSlide: 1,
        centeredSlides: true,
    });


    // --- 4. Scroll Animations (GSAP) ---
    function initScrollAnimations() {

        // Reveal Cards
        const revealElements = document.querySelectorAll(".gsap-reveal");
        revealElements.forEach(section => {
            gsap.fromTo(section,
                { autoAlpha: 0, y: 50, filter: "blur(10px)" },
                {
                    autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out",
                    scrollTrigger: {
                        trigger: section, start: "top 85%", toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Timeline Animation
        const timelineItems = document.querySelectorAll(".timeline-item");
        timelineItems.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -20 },
                {
                    opacity: 1, x: 0, duration: 0.8, delay: i * 0.2,
                    scrollTrigger: {
                        trigger: ".timeline-container",
                        start: "top 80%"
                    }
                }
            );
        });
    }

    // --- 5. Countdown Logic ---
    function initCountdown() {
        const weddingDate = new Date('April 26, 2026 15:00:00').getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.getElementById('countdown').innerHTML = "<div class='count-block'><span>¡Es Hoy!</span></div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    }

    initCountdown();

    // --- 6. Toast Notification Helper ---
    window.showToast = function (message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        container.appendChild(toast);

        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
        }, 3000);
    };

    // Copia texto al portapapeles de forma segura.
    // Nota para el mantenimiento: algunos valores visibles en la UI
    // pueden estar intencionalmente 'REDACTED' por privacidad.
    // En ese caso informamos al usuario en lugar de copiar datos sensibles.
    window.copyToClipboard = function (text) {
        if (!text || text === 'REDACTED') {
            showToast("Dato oculto por privacidad.");
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showToast("¡Copiado al portapapeles! 📋");
        }).catch(err => {
            console.error('Error copiando al portapapeles:', err);
            showToast('No se pudo copiar.');
        });
    }

    // --- 7. RSVP Logic (Restored) ---
    function initRSVP() {
        const urlParams = new URLSearchParams(window.location.search);
        const uuid = urlParams.get('id');
        const API_URL = 'backend/api.php';

        const rsvpSection = document.getElementById('rsvp-section');
        if (!rsvpSection) return;

        const heading = rsvpSection.querySelector('.section-heading h2');
        const actionsDiv = document.getElementById('rsvp-actions');

        if (!uuid) {
            // No ID in URL, hide RSVP section or show generic message
            actionsDiv.innerHTML = `<p class="dress-desc-text">Escanea tu código QR para confirmar asistencia.</p>`;
            return;
        }

        // Fetch Invitation Data
        fetch(`${API_URL}?action=get_guest&uuid=${uuid}`)
            .then(res => res.json())
            .then(data => {
                if (data.found && data.guests) {

                    if (data.invitation.status !== 'pending') {
                        heading.textContent = "¡Gracias por responder!";
                        actionsDiv.innerHTML = `
                            <div style="padding: 20px; text-align: center;">
                                <p class="dress-desc-text" style="font-size: 1.2rem; margin-bottom: 30px;">
                                    Tu respuesta: <strong>${data.invitation.status === 'confirmed' ? 'Asistiré' : 'No asistiré'}</strong>
                                </p>
                            </div>
                         `;
                        return;
                    }

                    // Build form for guests
                    let guestsHtml = '<div class="guests-list" style="margin-bottom: 20px;">';
                    data.guests.forEach(guest => {
                        guestsHtml += `
                            <div class="guest-item" style="margin-bottom: 10px; text-align: left; background: rgba(255,255,255,0.8); padding: 15px; border-radius: 10px; border: 1px solid #c5a059;">
                                <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                    <span style="font-weight: bold; font-size: 1.1rem; color: #555;">${guest.name}</span>
                                    <input type="checkbox" class="guest-check" value="${guest.id}" checked style="width: 20px; height: 20px; accent-color: var(--terracotta);">
                                </label>
                            </div>
                        `;
                    });
                    guestsHtml += '</div>';

                    actionsDiv.innerHTML = `
                        ${guestsHtml}
                        <textarea id="rsvp-message" placeholder="¿Algún mensaje para los novios? (Opcional)" style="width: 100%; padding: 15px; margin-bottom: 20px; border-radius: 10px; border: 1px solid #ddd; font-family: var(--font-body);"></textarea>
                        <div class="rsvp-buttons" style="display: flex; flex-direction: column; gap: 15px; justify-content: center; align-items: center;">
                            <button id="btn-confirm-all" style="background: var(--sage-green); color: white; border: none; padding: 12px 30px; border-radius: 30px; cursor: pointer; font-size: 1rem; width: 100%; max-width: 300px;">Confirmar Selección</button>
                            <button id="btn-decline-all" style="background: transparent; color: #999; border: 1px solid #ccc; padding: 12px 30px; border-radius: 30px; cursor: pointer; font-size: 0.9rem; width: 100%; max-width: 300px;">No podremos asistir</button>
                        </div>
                    `;

                    // Handle Confirm
                    document.getElementById('btn-confirm-all').addEventListener('click', () => {
                        const checkedIds = Array.from(document.querySelectorAll('.guest-check:checked')).map(cb => cb.value);
                        const message = document.getElementById('rsvp-message').value;

                        if (checkedIds.length === 0) {
                            showToast("Por favor selecciona al menos una persona.");
                            return;
                        }

                        submitRSVP(uuid, checkedIds, false, message);
                    });

                    // Handle Decline
                    document.getElementById('btn-decline-all').addEventListener('click', () => {
                        if (confirm("¿Seguro que deseas declinar la invitación?")) {
                            const message = document.getElementById('rsvp-message').value;
                            submitRSVP(uuid, [], true, message);
                        }
                    });

                } else {
                    console.log("Invitación no válida o expirada");
                    actionsDiv.innerHTML = `<p class="dress-desc-text">Enlace de invitación inválido.</p>`;
                }
            })
            .catch(err => console.error("Error fetching RSVP:", err));

        function submitRSVP(uuid, attendingIds, decline, message) {
            fetch(`${API_URL}?action=rsvp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uuid: uuid,
                    attending_ids: attendingIds,
                    decline: decline,
                    message: message
                })
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        heading.textContent = "¡Confirmación Recibida!";
                        actionsDiv.innerHTML = `
                        <div style="padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                            <p style="font-size: 3rem; margin-bottom: 20px;">💌</p>
                            <p style="font-size: 1.5rem; color: var(--terracotta); margin-bottom: 10px;">¡Gracias!</p>
                            <p class="dress-desc-text">Hemos guardado tu respuesta correctamente.</p>
                        </div>
                    `;
                        // Retrigger animations if needed
                        ScrollTrigger.refresh();
                    } else {
                        showToast("Error al guardar: " + response.error);
                    }
                })
                .catch(err => {
                    showToast("Error de conexión");
                    console.error(err);
                });
        }
    }

    initRSVP();

});
