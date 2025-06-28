// Image Optimization Script - Lazy Loading and WebP Support

document.addEventListener('DOMContentLoaded', function() {
    // Check WebP support
    const supportsWebP = (function() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
    })();

    // Lazy loading implementation
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => loadImage(img));
    }

    function loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        
        // Use WebP if supported and available
        if (supportsWebP && img.hasAttribute('data-webp')) {
            img.src = img.getAttribute('data-webp');
        } else {
            img.src = src;
        }
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        img.classList.add('loaded');
        
        // Remove data attributes after loading
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.removeAttribute('data-webp');
    }

    // Convert existing images to lazy loading
    const allImages = document.querySelectorAll('img:not([data-src])');
    allImages.forEach(img => {
        if (img.src && !img.complete) {
            // Move src to data-src for lazy loading
            img.setAttribute('data-src', img.src);
            img.removeAttribute('src');
            
            // Add loading placeholder
            img.classList.add('lazy');
            
            // Re-observe with IntersectionObserver
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });
                
                imageObserver.observe(img);
            }
        }
    });
});

// Picture element polyfill for older browsers
if (!('HTMLPictureElement' in window)) {
    document.createElement('picture');
}