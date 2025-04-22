document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mainContainer = document.getElementById('main-container');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const headline = document.getElementById('headline');
    const yearSpan = document.getElementById('current-year');
    const interactiveElements = document.querySelectorAll('a, button, .interactive-word, .highlight, .name, h2, .interactive-card, footer'); // Elements that trigger cursor change

    // --- Set Year ---
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Typing Effect ---
    const wordsToType = ["words.", "copy.", "ideas.", "pixels.", "fun!"];
    let wordIndex = 0;
    let letterIndex = 0;
    let currentWord = '';
    let isDeleting = false;
    
    function type() {
        const fullWord = wordsToType[wordIndex];
        let speed = 150; // Typing speed

        if (isDeleting) {
            currentWord = fullWord.substring(0, letterIndex - 1);
            letterIndex--;
            speed = 70; // Deleting speed
        } else {
            currentWord = fullWord.substring(0, letterIndex + 1);
            letterIndex++;
        }

         // Update text content - keep "I play with " part static
        headline.innerHTML = `I play with <span class="highlight wiggle-on-hover">${currentWord}</span>`;

         // Add blinking caret effect class if needed (handled by CSS now)
        // headline.classList.add('typing-effect'); // Ensure caret shows
        
        // Re-add hover listeners if highlight gets recreated (not strictly needed if parent `h1` handles it)
         // const newHighlight = headline.querySelector('.highlight');
         // if (newHighlight) addHoverListeners(newHighlight);

        if (!isDeleting && letterIndex === fullWord.length) {
            // Pause at end of word
            speed = 1500;
            isDeleting = true;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsToType.length;
            speed = 500; // Pause before typing new word
             // Remove caret temporarily when word is empty? Optional.
             // headline.classList.remove('typing-effect'); 
        }

        setTimeout(type, speed);
    }
    if(headline) setTimeout(type, 800); // Start after initial delay

    // --- Custom Cursor Logic ---
    let mouseX = 0, mouseY = 0;
     let dotX = 0, dotY = 0;
     let outlineX = 0, outlineY = 0;
     
     window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop for smoother cursor movement
    function animateCursor() {
         // Ease the dot movement (lerp)
        dotX += (mouseX - dotX) * 0.7;
        dotY += (mouseY - dotY) * 0.7;
         
         // Ease the outline movement (slower lerp for smoother trail)
         outlineX += (mouseX - outlineX) * 0.2;
         outlineY += (mouseY - outlineY) * 0.2;
        
         if(cursorDot) cursorDot.style.transform = `translate(${dotX - cursorDot.offsetWidth/2}px, ${dotY - cursorDot.offsetHeight/2}px)`;
        if(cursorOutline) cursorOutline.style.transform = `translate(${outlineX- cursorOutline.offsetWidth/2}px, ${outlineY - cursorOutline.offsetHeight/2}px) scale(${body.dataset.cursor === 'hover' ? 1.4 : (body.dataset.cursor === 'click' ? 0.8 : 1)})`; // Apply scale here too

        requestAnimationFrame(animateCursor);
    }
    // Check if not touch device before starting cursor animation
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
         animateCursor(); // Start the animation loop only for non-touch
    } else {
         // Optionally hide custom cursor elements completely on touch devices
         if(cursorDot) cursorDot.style.display = 'none';
         if(cursorOutline) cursorOutline.style.display = 'none';
    }


    // Add cursor state listeners
    function addHoverListeners(element) {
        element.addEventListener('mouseenter', () => body.dataset.cursor = 'hover');
        element.addEventListener('mouseleave', () => body.dataset.cursor = '');
    }
    interactiveElements.forEach(addHoverListeners);

     // Add click listeners for visual feedback
     document.addEventListener('mousedown', () => body.dataset.cursor = 'click');
     document.addEventListener('mouseup', () => body.dataset.cursor = 'hover'); // Revert to hover if still over element

     // --- Container Tilt Effect ---
     if (mainContainer) {
         const maxTilt = 5; // Max tilt degrees
         
         // Check for non-touch device before adding tilt effect
         if (!('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
              body.addEventListener('mousemove', (e) => {
                  const rect = mainContainer.getBoundingClientRect();
                  // Calculate position relative to container center (adjust if container isn't centered perfectly)
                  const centerX = rect.left + rect.width / 2; 
                  const centerY = rect.top + rect.height / 2; 
                  
                  const deltaX = e.clientX - centerX;
                  const deltaY = e.clientY - centerY;
                  
                  const rotateY = (deltaX / (rect.width / 2)) * maxTilt;
                  const rotateX = (-deltaY / (rect.height / 2)) * maxTilt; // Invert Y rotation

                  // Apply smooth tilt - requestAnimationFrame helps performance
                  requestAnimationFrame(() => {
                      mainContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                  });
              });
              
               body.addEventListener('mouseleave', () => {
                   // Reset tilt when mouse leaves body
                   requestAnimationFrame(() => {
                       mainContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                   });
               });
          }
     }
    
});