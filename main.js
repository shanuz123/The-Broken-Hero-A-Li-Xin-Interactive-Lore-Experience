document.addEventListener("DOMContentLoaded", () => {
  
  // --- Parallax Scrolling ---
  const parallaxSections = document.querySelectorAll('.parallax-section');
  
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY;

    parallaxSections.forEach(section => {
      let rect = section.getBoundingClientRect();
      // Only animate if in view
      if(rect.top < window.innerHeight && rect.bottom > 0) {
        let bg = section.querySelector('.parallax-bg');
        if(bg) {
          // Adjust scroll speed multiplier (0.3 is standard parallax)
          let speed = 0.4;
          let yPos = (rect.top * speed);
          bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      }
    });
  });

  // --- Scroll Reveal Animations & Nav Syncing ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const navAmulets = document.querySelectorAll('.amulet');
  const navMap = {};
  navAmulets.forEach(amulet => {
    navMap[amulet.getAttribute('data-target')] = amulet;
    
    // Click navigation
    amulet.addEventListener('click', () => {
      let targetId = amulet.getAttribute('data-target');
      document.getElementById(targetId).scrollIntoView({behavior: 'smooth'});
    });
  });

  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Handle Nav Syncing
      if (entry.isIntersecting && entry.target.classList.contains('story-section')) {
         const id = entry.target.id;
         if(navMap[id]) {
            navAmulets.forEach(n => n.classList.remove('active'));
            navMap[id].classList.add('active');
         }
      }
    });
  }, { threshold: 0.5 }); // Use a higher threshold for navigation updates

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.story-section').forEach(sec => sectionObserver.observe(sec));
  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- Duality Slider (Section 5) ---
  const dualityContainer = document.getElementById('duality-container');
  const radiantSide = document.getElementById('radiant-side');
  const sliderHandle = document.getElementById('slider-handle');
  
  if (dualityContainer && radiantSide && sliderHandle) {
    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = dualityContainer.getBoundingClientRect();
      // Ensure drag stays within bounds
      let xPos = clientX - rect.left;
      if (xPos < 0) xPos = 0;
      if (xPos > rect.width) xPos = rect.width;
      
      let percentage = (xPos / rect.width) * 100;
      
      radiantSide.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      sliderHandle.style.left = `${percentage}%`;
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      e.preventDefault(); // Prevent text selection
      // Move immediately to where user clicked
      moveSlider(e.clientX || (e.touches && e.touches[0].clientX));
    };
    
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      let clientX = e.clientX;
      if(e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
      
      // Request Animation Frame for performance
      requestAnimationFrame(() => moveSlider(clientX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Mouse events
    dualityContainer.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch events for mobile
    dualityContainer.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
  }

});
