document.addEventListener('DOMContentLoaded', () => {
    const imgs = [...document.querySelectorAll('.lightbox-img')];
    if (!imgs.length) return;

    const lb = document.getElementById('lightbox');
    const lbContent = document.querySelector('.lightbox-content');
    const lbImg = document.getElementById('lightbox-img');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const closeBtn = document.getElementById('lb-close');

    let index = 0;

    const open = i => {
        index = i;
        lbImg.src = imgs[index].src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Lightbox opened, index:', index);
    };

    const close = () => {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Lightbox closed');
    };

    const move = dir => {
        index = (index + dir + imgs.length) % imgs.length;
        lbImg.src = imgs[index].src;
        console.log('Moved to index:', index);
    };

    imgs.forEach((img, i) => img.addEventListener('click', () => open(i)));

    // Button click handlers
    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        move(-1);
    });
    
    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        move(1);
    });
    
    closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        close();
    });

    // Touch handlers for buttons (mobile)
    prevBtn?.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        move(-1);
    });
    
    nextBtn?.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        move(1);
    });
    
    closeBtn?.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        close();
    });

    // Click outside to close
    lb?.addEventListener('click', (e) => {
        console.log('Click detected on lightbox, target:', e.target);
        // Close if clicking anywhere except the actual image and buttons
        if (e.target !== lbImg && 
            e.target !== prevBtn && 
            e.target !== nextBtn && 
            e.target !== closeBtn) {
            close();
        }
    });

    let touchStartTarget = null;
    
    lb?.addEventListener('touchstart', (e) => {
        touchStartTarget = e.target;
    }, { passive: true });

    lb?.addEventListener('touchend', (e) => {
        if (touchStartTarget === e.target && 
            e.target !== lbImg && 
            e.target !== prevBtn && 
            e.target !== nextBtn && 
            e.target !== closeBtn) {
            e.preventDefault();
            close();
        }
        touchStartTarget = null;
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') move(-1);
        if (e.key === 'ArrowRight') move(1);
        if (e.key === 'Escape') close();
    });

    // Swipe gestures for mobile navigation
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    lbImg?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lbImg?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                move(-1);
            } else {
                move(1); 
            }
        }
    }, { passive: true });
});

let controlsTimeout;

function showControls() {
    if (window.innerWidth <= 768) {
        lb?.classList.add('show-controls');
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            lb?.classList.remove('show-controls');
        }, 3000);
    }
}

function hideControls() {
    if (window.innerWidth <= 768) {
        lb?.classList.remove('show-controls');
        clearTimeout(controlsTimeout);
    }
}

// Show controls when user touches the screen
lb?.addEventListener('touchstart', showControls, { passive: true });

// Show controls when lightbox opens
const originalOpen = open;
open = function(i) {
    originalOpen(i);
    showControls();
};

