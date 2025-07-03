// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileMenuToggle && navMenu) {
        // Toggle menu open/close
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Update aria-label for accessibility
            const isOpen = navMenu.classList.contains('active');
            this.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        });
        
        // Close menu when clicking on overlay
        document.addEventListener('click', function(e) {
            if (body.classList.contains('menu-open') && 
                !navMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-label', 'メニューを開く');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-label', 'メニューを開く');
            });
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }, 250);
        });
    }
});