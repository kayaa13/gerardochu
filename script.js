
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MENÚ MÓVIL
  ========================= */

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú' : 'Abrir menú'
      );
    });

    // Cerrar el menú al seleccionar un enlace
    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navigation.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Abrir menú');
        }
      });
    });

    // Cerrar el menú con Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }


 
  /* =========================
     MENÚ MÓVIL Y SUBMENÚ PROYECTOS
  ========================= */

 
  // Abrir y cerrar el menú principal
  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú' : 'Abrir menú'
      );
    });

    // Cerrar el menú al seleccionar un enlace,
    // excepto PROYECTOS, que controla su propio submenú.
    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth > 900) return;

        if (link.classList.contains('projects-link')) return;

        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');

        // Reiniciar el submenú para la próxima apertura.
        if (dropdown) {
          dropdown.classList.remove('open');
        }

        if (projectsLink) {
          projectsLink.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Cerrar menú y submenú con Escape.
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');

      if (dropdown) {
        dropdown.classList.remove('open');
      }

      if (projectsLink) {
        projectsLink.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Control del submenú PROYECTOS en móvil
  if (dropdown && projectsLink) {
    projectsLink.setAttribute('aria-haspopup', 'true');
    projectsLink.setAttribute('aria-expanded', 'false');

    projectsLink.addEventListener('click', (event) => {
      if (window.innerWidth <= 900) {
        event.preventDefault();

        const isOpen = dropdown.classList.toggle('open');

        projectsLink.setAttribute(
          'aria-expanded',
          String(isOpen)
        );
      }
    });
  }


  /* =========================
     ANIMACIÓN "QUIÉN SOY"
  ========================= */

  const aboutSection = document.querySelector('#about');

  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutSection.classList.add('is-visible');
          } else {
            aboutSection.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    aboutObserver.observe(aboutSection);
  }


  
  /* =========================
     CONTADORES
     REINICIAR AL ENTRAR Y SALIR
  ========================= */

  const statsSection = document.querySelector('#about-stats');
  const counters = document.querySelectorAll('.stat-number');

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let counterAnimationFrames = [];

  function stopCounters() {
    // Cancelar las animaciones que todavía estén ejecutándose.
    counterAnimationFrames.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });

    counterAnimationFrames = [];

    // Devolver todos los números a cero.
    counters.forEach((counter) => {
      counter.textContent = '0';
    });
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      counter.textContent = `${target}+`;
      return;
    }

    const duration = 3000;
    const startTime = performance.now();


function updateCounter(currentTime) {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  const easedProgress = 1 - Math.pow(1 - progress, 3);

  if (progress < 1) {
    if (
      !updateCounter.lastUpdate ||
      currentTime - updateCounter.lastUpdate >= 150
    ) {
      const currentValue = Math.floor(
        Math.random() * (target + 1)
      );

      counter.textContent = `${currentValue}+`;
      updateCounter.lastUpdate = currentTime;
    }

    const frameId = requestAnimationFrame(updateCounter);
    counterAnimationFrames.push(frameId);
  } else {
    counter.textContent = `${target}+`;
  }
}


    const frameId = requestAnimationFrame(updateCounter);
    counterAnimationFrames.push(frameId);
  }

  if (statsSection && counters.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Comenzar desde cero cada vez que se entra.
            stopCounters();

            counters.forEach((counter) => {
              animateCounter(counter);
            });
          } else {
            // Detener y reiniciar al salir de la sección.
            stopCounters();
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    statsObserver.observe(statsSection);
  }



 
  /* =========================
     MERCEDES AMG
     TEXTO GLITCH → VIDEO
     REINICIAR AL REGRESAR
  ========================= */

  const mercedesSection = document.querySelector('#mercedes');
  const mercedesVideo = mercedesSection
    ? mercedesSection.querySelector('.mercedes-video')
    : null;

  if (mercedesSection && mercedesVideo) {
    const mercedesLines = mercedesSection.querySelectorAll(
      '.mercedes-line'
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const introDuration = reducedMotion ? 500 : 4500;

    let introTimeout = null;
    let isPlayingSequence = false;

    // Detener y reiniciar todo al salir de Mercedes.
    function resetMercedes() {
      isPlayingSequence = false;

      if (introTimeout !== null) {
        clearTimeout(introTimeout);
        introTimeout = null;
      }

      mercedesVideo.pause();

      try {
        mercedesVideo.currentTime = 0;
      } catch (error) {
        // El video puede no haber terminado de cargar todavía.
      }

      mercedesSection.classList.remove(
        'is-active',
        'video-visible'
      );

      // Preparar las líneas para repetir el glitch al regresar.
      mercedesLines.forEach((line) => {
        line.style.animation = 'none';
      });

      void mercedesSection.offsetWidth;

      mercedesLines.forEach((line) => {
        line.style.removeProperty('animation');
      });
    }

    // Mostrar el texto y luego reproducir el video desde el inicio.
    function startMercedes() {
      if (isPlayingSequence) return;

      isPlayingSequence = true;

      resetMercedes();
      isPlayingSequence = true;

      mercedesSection.classList.add('is-active');

      introTimeout = window.setTimeout(() => {
        introTimeout = null;

        // No reproducir si ya se salió de la sección.
        if (!isPlayingSequence) return;

        mercedesSection.classList.add('video-visible');

        try {
          mercedesVideo.currentTime = 0;
        } catch (error) {
          // Se intentará reproducir cuando el navegador lo permita.
        }

        mercedesVideo.play().catch((error) => {
          console.warn(
            'No se pudo reproducir el video de Mercedes AMG:',
            error
          );
        });
      }, introDuration);
    }

    // El video permanece detenido mientras Mercedes no esté visible.
    resetMercedes();

    const mercedesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startMercedes();
          } else {
            resetMercedes();
          }
        });
      },
      {
        threshold: 0.25
      }
    );

    mercedesObserver.observe(mercedesSection);
  }







/* =========================
   JOYAS
   SCROLL + BARRA + CONTADOR
========================= */

const jewelrySection = document.querySelector('#joyas');

if (jewelrySection) {
  const scenes = [
    ...jewelrySection.querySelectorAll('.jewelry-scene')
  ];

  const video = jewelrySection.querySelector('video');
  const progressFill = jewelrySection.querySelector('.jewelry-progress-fill');
  const currentCounter = jewelrySection.querySelector('.jewelry-current');
  const progressBar = jewelrySection.querySelector('.jewelry-progress-track');
  const totalCounter = jewelrySection.querySelector('.jewelry-total');

  let activeIndex = -1;
  let ticking = false;

let jewelryWasOutside = true;

const jewelryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (jewelryWasOutside) {
        jewelryWasOutside = false;

        if (video) {
          video.pause();
          video.currentTime = 0;
        }

        activeIndex = -1;
        requestJewelryUpdate();
      }
    } else {
      jewelryWasOutside = true;

      if (video) {
        video.pause();
        video.currentTime = 0;
      }

      activeIndex = -1;
    }
  });
}, { threshold: 0.01 });

jewelryObserver.observe(jewelrySection);

  if (totalCounter) {
    totalCounter.textContent = String(scenes.length).padStart(2, '0');
  }

  
function updateJewelryScenes() {
  ticking = false;

  if (scenes.length === 0) return;

  const rect = jewelrySection.getBoundingClientRect();
  const scrollableDistance =
    jewelrySection.offsetHeight - window.innerHeight;

  if (scrollableDistance <= 0) return;

  const progress = Math.max(
    0,
    Math.min(0.999999, -rect.top / scrollableDistance)
  );

  const index = Math.min(
    scenes.length - 1,
    Math.floor(progress * scenes.length)
  );

  if (index !== activeIndex) {
    const previousIndex = activeIndex;
    activeIndex = index;

    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === index);
    });

    if (video) {
      if (index === scenes.length - 1) {
        video.pause();
        video.currentTime = 0;

        video.play().catch((error) => {
          console.warn('Error al reproducir el video de joyería:', error);
        });
      } else {
        video.pause();

        if (previousIndex === scenes.length - 1) {
          video.currentTime = 0;
        }
      }
    }
  }

  if (progressFill) {
    progressFill.style.width =
      `${((index + 1) / scenes.length) * 100}%`;
  }

  if (currentCounter) {
    currentCounter.textContent =
      String(index + 1).padStart(2, '0');
  }

  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', String(index + 1));
  }
}


  function requestJewelryUpdate() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateJewelryScenes);
  }

  window.addEventListener('scroll', requestJewelryUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestJewelryUpdate);

  updateJewelryScenes();
}



/* =========================
   TRAYECTORIA
   SCROLL CINEMATOGRÁFICO
========================= */

(() => {
  const section = document.querySelector('#experience');

  if (!section) return;

  const items = [...section.querySelectorAll('.experience-item')];
  const progressFill = section.querySelector('.experience-progress-fill');
  const currentCounter = section.querySelector('.experience-current');

  if (!items.length || !progressFill || !currentCounter) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let activeIndex = -1;
  

  function updateTimeline() {
    ticking = false;

   

    const rect = section.getBoundingClientRect();
    const scrollableDistance = section.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    const progress = Math.max(
      0,
      Math.min(1, -rect.top / scrollableDistance)
    );

    const index = Math.min(
      items.length - 1,
      Math.floor(progress * items.length)
    );

    progressFill.style.width = `${progress * 100}%`;

    if (index !== activeIndex) {
      activeIndex = index;

      items.forEach((item, i) => {
        item.classList.toggle('is-current', i === activeIndex);
      });

      currentCounter.textContent = String(activeIndex + 1).padStart(2, '0');
    }
  }

  function requestUpdate() {
    if (ticking) return;

    ticking = true;

    if (reducedMotion) {
      updateTimeline();
    } else {
      window.requestAnimationFrame(updateTimeline);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  updateTimeline();
})();



/* =========================
   E-LEARNING · STA
   SCROLL CONTROLADO
========================= */

(() => {
  const section = document.querySelector('#elearning');

  if (!section) return;

  const scenes = [...section.querySelectorAll('.sta-scene')];
  const counter = section.querySelector('.sta-current');
  const progress = section.querySelector('.sta-progress-fill');

  if (!scenes.length || !counter || !progress) return;

  let activeIndex = -1;
  let ticking = false;

  function updateSTA() {
    ticking = false;

    // En móvil se conserva el desplazamiento por escenas.
    const rect = section.getBoundingClientRect();
    const distance = section.offsetHeight - window.innerHeight;

    if (distance <= 0) return;

    const amount = Math.max(0, Math.min(1, -rect.top / distance));

    const index = Math.min(
      scenes.length - 1,
      Math.floor(amount * scenes.length)
    );

    progress.style.width = `${amount * 100}%`;

    if (index !== activeIndex) {
      activeIndex = index;

      scenes.forEach((scene, i) => {
        scene.classList.toggle('is-current', i === activeIndex);
      });

      counter.textContent = String(activeIndex + 1).padStart(2, '0');
    }
  }

  function requestUpdate() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateSTA);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  updateSTA();
})();


/* =========================
   BRANDING — BLOOM
   ESCENAS CONTROLADAS POR SCROLL
========================= */

const bloomSection = document.querySelector('#branding');

if (bloomSection) {
  const bloomStage = bloomSection.querySelector('.branding-stage');
  const bloomScenes = [
    ...bloomSection.querySelectorAll('.branding-scene')
  ];
  const bloomVideo = bloomSection.querySelector('.bloom-video');

  let bloomIndex = -1;
  let bloomFrame = null;

  function updateBloom() {
    bloomFrame = null;

    const rect = bloomSection.getBoundingClientRect();
    const scrollDistance = bloomSection.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    const progress = Math.max(
      0,
      Math.min(1, -rect.top / scrollDistance)
    );

    const index = Math.min(
      bloomScenes.length - 1,
      Math.floor(progress * bloomScenes.length)
    );

    if (index === bloomIndex) return;

    bloomIndex = index;

    bloomScenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === bloomIndex);
    });

    if (bloomVideo) {
      if (bloomIndex === 2) {
        if (bloomVideo.ended) {
          bloomVideo.currentTime = 0;
        }

        bloomVideo.play().catch((error) => {
          console.warn('No se pudo reproducir el video BLOOM:', error);
        });
      } else {
        bloomVideo.pause();
        bloomVideo.currentTime = 0;
      }
    }
  }

  function requestBloomUpdate() {
    if (bloomFrame !== null) return;

    bloomFrame = window.requestAnimationFrame(updateBloom);
  }

  window.addEventListener('scroll', requestBloomUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestBloomUpdate);

  if (bloomVideo) {
    bloomVideo.addEventListener('ended', () => {
      // El usuario controla el cambio de escena con el scroll.
      // No avanzamos automáticamente al terminar el video.
    });
  }

  updateBloom();
}



/* =========================================
   RITUAL RESERVE — SCROLL EXPERIENCE
========================================= */

const ritualSection = document.querySelector('#ritual-reserve');

if (ritualSection) {
  const ritualScenes = [
    ...ritualSection.querySelectorAll('.ritual-scene')
  ];

  const ritualVideo = ritualSection.querySelector('.ritual-video');

  let ritualIndex = -1;
  let ritualFrame = null;

  function updateRitual() {
    ritualFrame = null;

    const sectionTop =
      window.scrollY +
      ritualSection.getBoundingClientRect().top;

    const scrollDistance =
      ritualSection.offsetHeight -
      document.documentElement.clientHeight;

    if (scrollDistance <= 0 || ritualScenes.length === 0) return;

    const progress = Math.max(
      0,
      Math.min(
        1,
        (window.scrollY - sectionTop) / scrollDistance
      )
    );

    const index = Math.min(
      ritualScenes.length - 1,
      Math.floor(progress * ritualScenes.length)
    );

    if (index === ritualIndex) return;

    ritualIndex = index;

    ritualScenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === ritualIndex);
    });

    if (ritualVideo) {
      if (ritualIndex === 2) {
        ritualVideo.play().catch(() => {});
      } else {
        ritualVideo.pause();
        ritualVideo.currentTime = 0;
      }
    }
  }

  function requestRitualUpdate() {
    if (ritualFrame !== null) return;

    ritualFrame = window.requestAnimationFrame(updateRitual);
  }

  window.addEventListener('scroll', requestRitualUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestRitualUpdate);

  window.addEventListener('orientationchange', requestRitualUpdate);

  updateRitual();
}



/* CONTACTO — PREPARAR CORREO */

const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = formData.get('name');
    const email = formData.get('email');
    const project = formData.get('project');
    const message = formData.get('message');

    const subject = encodeURIComponent(`Consulta de proyecto: ${project}`);

    const body = encodeURIComponent(
      `Hola Gerardo,\n\n${message}\n\n` +
      `Nombre: ${name}\n` +
      `Correo: ${email}\n` +
      `Tipo de proyecto: ${project}`
    );

    window.location.href =
      `mailto:kayaa13@gmail.com?subject=${subject}&body=${body}`;
  });
}
 

});