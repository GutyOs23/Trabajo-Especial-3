// Esperar a que cargue todo
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DOM =====
    const pantallaCarga = document.getElementById('pantalla-carga');
    const contenedorPrincipal = document.getElementById('contenedor-principal');
    const libro = document.getElementById('libro');
    const btnAbrirLibro = document.getElementById('btn-abrir-libro');
    const btnCerrarLibro = document.getElementById('btn-cerrar-libro');
    const btnMusicaFondo = document.getElementById('btn-musica-fondo');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnPaginaAnterior = document.getElementById('btn-pagina-anterior');
    const btnPaginaSiguiente = document.getElementById('btn-pagina-siguiente');
    const indicadorPagina = document.getElementById('indicador-pagina');
    const btnSiSalir = document.getElementById('btn-si-salir');
    const btnCaptura = document.getElementById('btn-captura');
    const mensajeCaptura = document.getElementById('mensaje-captura');
    
    // Botones de música por página
    const botonesMusicaPagina = document.querySelectorAll('.btn-musica-pagina');
    const botonesMensajeEspecial = document.querySelectorAll('.btn-mensaje-especial');
    
    // ===== VARIABLES GLOBALES =====
    let paginaActual = 0;
    let libroAbierto = false;
    let musicaFondoActiva = false;
    let audioFondo = null;
    let audioActualPagina = null;
    let cancionActualPagina = null;
    
    // Lista de páginas
    const listaPaginas = document.querySelectorAll('.pagina');
    const nombresPaginas = [
        "Portada ✨",
        "Harry Potter ⚡",
        "Blair Waldorf 👑",
        "Real Madrid 🤍",
        "Jude Bellingham 🔟",
        "CR7 🐐",
        "Scorpions 🎸",
        "Cholita Paceña 🪶",
        "Club Bolívar 🔵⚪",
        "Poemas 📖",
        "¿Celebramos? 🎁",
        "Contraportada 📖"
    ];
    
    // ===== CARGA INICIAL =====
    let progreso = 0;
    const barraProgreso = document.getElementById('barra-progreso');
    const intervaloProgreso = setInterval(() => {
        progreso += Math.random() * 15;
        if (progreso >= 100) {
            progreso = 100;
            clearInterval(intervaloProgreso);
            setTimeout(() => {
                pantallaCarga.style.opacity = '0';
                setTimeout(() => {
                    pantallaCarga.classList.add('oculto');
                    contenedorPrincipal.classList.remove('oculto');
                }, 500);
            }, 500);
        }
        if (barraProgreso) {
            barraProgreso.style.width = Math.min(progreso, 100) + '%';
        }
    }, 200);
    
    // ===== FUNCIONES DE NAVEGACIÓN =====
    function actualizarVisibilidadPaginas() {
        listaPaginas.forEach((pagina, index) => {
            if (index === paginaActual) {
                pagina.classList.add('mostrar-pagina');
                pagina.classList.remove('ocultar-pagina');
            } else {
                pagina.classList.add('ocultar-pagina');
                pagina.classList.remove('mostrar-pagina');
            }
        });
        
        if (indicadorPagina) {
            indicadorPagina.textContent = nombresPaginas[paginaActual] || `Página ${paginaActual + 1}`;
        }
        
        if (btnPaginaAnterior) {
            btnPaginaAnterior.disabled = paginaActual === 0;
        }
        if (btnPaginaSiguiente) {
            btnPaginaSiguiente.disabled = paginaActual === listaPaginas.length - 1;
        }
        
        // Detener música de página al cambiar
        if (audioActualPagina) {
            audioActualPagina.pause();
            audioActualPagina.currentTime = 0;
            if (cancionActualPagina) {
                cancionActualPagina.classList.remove('activo');
            }
            cancionActualPagina = null;
            audioActualPagina = null;
        }
    }
    
    function paginaSiguiente() {
        if (paginaActual < listaPaginas.length - 1) {
            paginaActual++;
            actualizarVisibilidadPaginas();
            lanzarConfetiSuave();
        }
    }
    
    function paginaAnterior() {
        if (paginaActual > 0) {
            paginaActual--;
            actualizarVisibilidadPaginas();
            lanzarConfetiSuave();
        }
    }
    
    // ===== ABRIR Y CERRAR LIBRO =====
    if (btnAbrirLibro) {
        btnAbrirLibro.addEventListener('click', function() {
            libro.classList.add('abierto');
            libroAbierto = true;
            paginaActual = 1;
            actualizarVisibilidadPaginas();
            lanzarConfetiMasivo();
            mostrarMensajeFlotante("✨ El libro se abre... tu historia comienza ✨");
        });
    }
    
    if (btnCerrarLibro) {
        btnCerrarLibro.addEventListener('click', function() {
            libro.classList.remove('abierto');
            libroAbierto = false;
            paginaActual = 0;
            actualizarVisibilidadPaginas();
            mostrarMensajeFlotante("📖 Hasta la próxima página... 📖");
        });
    }
    
    // ===== MÚSICA DE FONDO =====
    function toggleMusicaFondo() {
        if (!audioFondo) {
            audioFondo = new Audio('musica/cancion-principal.mp3');
            audioFondo.loop = true;
            audioFondo.volume = 0.2;
        }
        
        if (musicaFondoActiva) {
            audioFondo.pause();
            btnMusicaFondo.classList.remove('activo');
            musicaFondoActiva = false;
        } else {
            audioFondo.play().catch(e => console.log('Autoplay bloqueado'));
            btnMusicaFondo.classList.add('activo');
            musicaFondoActiva = true;
        }
    }
    
    if (btnMusicaFondo) {
        btnMusicaFondo.addEventListener('click', toggleMusicaFondo);
    }
    
    // ===== MÚSICA POR PÁGINA =====
    botonesMusicaPagina.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.stopPropagation();
            const cancion = this.getAttribute('data-cancion');
            const nombreCancion = this.getAttribute('data-nombre');
            
            if (audioActualPagina && cancionActualPagina === this) {
                audioActualPagina.pause();
                audioActualPagina.currentTime = 0;
                this.classList.remove('activo');
                audioActualPagina = null;
                cancionActualPagina = null;
                mostrarMensajeFlotante(`⏸️ Música detenida: ${nombreCancion}`);
                return;
            }
            
            if (audioActualPagina) {
                audioActualPagina.pause();
                audioActualPagina.currentTime = 0;
                if (cancionActualPagina) {
                    cancionActualPagina.classList.remove('activo');
                }
            }
            
            const nuevaCancion = new Audio(`musica/${cancion}`);
            nuevaCancion.volume = 0.3;
            nuevaCancion.play().catch(e => {
                console.log('Error:', e);
                mostrarMensajeFlotante(`🎵 No se pudo reproducir ${nombreCancion}`);
            });
            
            audioActualPagina = nuevaCancion;
            cancionActualPagina = this;
            this.classList.add('activo');
            mostrarMensajeFlotante(`🎵 Reproduciendo: ${nombreCancion} 🎵`);
            
            nuevaCancion.addEventListener('ended', function() {
                if (cancionActualPagina) {
                    cancionActualPagina.classList.remove('activo');
                }
                audioActualPagina = null;
                cancionActualPagina = null;
            });
        });
    });
    
    // ===== MENSAJES ESPECIALES (POPUP CENTRADO) =====
    botonesMensajeEspecial.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const mensaje = this.getAttribute('data-mensaje');
            
            if (mensaje) {
                mostrarPopupMensaje(mensaje);
                lanzarConfeti();
            }
        });
    });
    
    function mostrarPopupMensaje(mensaje) {
        const popupExistente = document.querySelector('.popup-mensaje');
        if (popupExistente) popupExistente.remove();
        
        const popup = document.createElement('div');
        popup.className = 'popup-mensaje';
        popup.innerHTML = `
            <p>${mensaje}</p>
            <button class="cerrar-popup">❤️ Cerrar ❤️</button>
        `;
        document.body.appendChild(popup);
        
        popup.querySelector('.cerrar-popup').addEventListener('click', () => {
            popup.remove();
        });
        
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 8000);
    }
    
    // ===== BOTÓN DE SALIDA =====
    if (btnSiSalir) {
        btnSiSalir.addEventListener('click', function() {
            mostrarMensajeFlotante("🎁 ¡Me alegra mucho! La sorpresa te va a encantar... te la cuento cuando nos veamos 🎁");
            lanzarConfetiMasivo();
            if (mensajeCaptura) {
                mensajeCaptura.classList.remove('oculto');
            }
        });
    }
    
    if (btnCaptura) {
        btnCaptura.addEventListener('click', function() {
            if (mensajeCaptura) {
                mensajeCaptura.classList.remove('oculto');
            }
            mostrarMensajeFlotante("📸 ¡Toma captura y envíamela! Así sé que quieres descubrir la sorpresa conmigo 💕");
            lanzarConfeti();
            
            navigator.clipboard.writeText("¡Sí quiero salir con Brandon! 🎁").then(() => {
                mostrarMensajeFlotante("✨ Mensaje copiado. Pega y envía la captura ✨");
            }).catch(() => {});
        });
    }
    
    // ===== NAVEGACIÓN =====
    if (btnPaginaSiguiente) {
        btnPaginaSiguiente.addEventListener('click', paginaSiguiente);
    }
    if (btnPaginaAnterior) {
        btnPaginaAnterior.addEventListener('click', paginaAnterior);
    }
    
    // ===== EFECTOS =====
    function lanzarConfeti() {
        if (typeof canvasConfetti !== 'undefined') {
            canvasConfetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#ff0000', '#ff8c00', '#ffffff']
            });
        }
    }
    
    function lanzarConfetiSuave() {
        if (typeof canvasConfetti !== 'undefined') {
            canvasConfetti({
                particleCount: 40,
                spread: 50,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#ffd700']
            });
        }
    }
    
    function lanzarConfetiMasivo() {
        if (typeof canvasConfetti !== 'undefined') {
            canvasConfetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#d4af37', '#ff0000', '#ff8c00', '#ffffff', '#ff69b4']
            });
            setTimeout(() => {
                canvasConfetti({
                    particleCount: 150,
                    spread: 120,
                    origin: { y: 0.3 },
                    colors: ['#d4af37', '#ffd700']
                });
            }, 200);
        }
    }
    
    function mostrarMensajeFlotante(texto) {
        const mensajeAnterior = document.querySelector('.mensaje-flotante');
        if (mensajeAnterior) mensajeAnterior.remove();
        
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-flotante';
        mensaje.textContent = texto;
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.style.opacity = '0';
            setTimeout(() => mensaje.remove(), 500);
        }, 3500);
    }
    
    // ===== EFECTO SIUUU PARA CR7 =====
    function crearSiiuuu() {
        const siiuu = document.createElement('div');
        siiuu.className = 'siiuuu-texto';
        siiuu.textContent = 'SIIIIUUUUUUUU! 🐐';
        document.body.appendChild(siiuuu);
        setTimeout(() => siiuu.remove(), 1500);
    }
    
    // Exponer función para CR7
    window.crearSiiuuu = crearSiiuuu;
    
    // Inicializar
    actualizarVisibilidadPaginas();
    
    console.log('✨ El Libro de Mishel está listo. ¡Feliz cumpleaños! ✨');
});