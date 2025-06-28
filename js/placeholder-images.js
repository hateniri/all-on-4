// Placeholder Image Generator
function createPlaceholder(width, height, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
    
    // Diagonal lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    
    // Text background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const textHeight = 60;
    ctx.fillRect(0, (height - textHeight) / 2, width, textHeight);
    
    // Size text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${width} × ${height}px`, width / 2, height / 2 - 10);
    
    // Label text
    if (text) {
        ctx.font = '16px "Noto Sans JP", sans-serif';
        ctx.fillText(text, width / 2, height / 2 + 15);
    }
    
    return canvas.toDataURL('image/png');
}

// Generate placeholders on page load
document.addEventListener('DOMContentLoaded', function() {
    // Find all placeholder images
    const placeholders = document.querySelectorAll('img[data-placeholder]');
    
    placeholders.forEach(img => {
        const width = parseInt(img.getAttribute('data-width') || 800);
        const height = parseInt(img.getAttribute('data-height') || 600);
        const label = img.getAttribute('data-label') || '';
        
        img.src = createPlaceholder(width, height, label);
        img.alt = `プレースホルダー画像 ${width}×${height}px ${label}`;
    });
    
    // Lazy load real images when available
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const realSrc = img.getAttribute('data-src');
                    
                    // Check if real image exists
                    const testImg = new Image();
                    testImg.onload = function() {
                        img.src = realSrc;
                        img.classList.add('loaded');
                    };
                    testImg.onerror = function() {
                        // Keep placeholder if real image doesn't exist
                        console.log(`Image not found: ${realSrc}`);
                    };
                    testImg.src = realSrc;
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Placeholder definitions for different page sections
const placeholderConfig = {
    hero: { width: 1920, height: 1080, label: 'ヒーロー背景画像' },
    heroTablet: { width: 1200, height: 800, label: 'ヒーロー背景（タブレット）' },
    heroMobile: { width: 800, height: 600, label: 'ヒーロー背景（モバイル）' },
    clinicExterior: { width: 800, height: 600, label: 'クリニック外観' },
    clinicInterior: { width: 800, height: 600, label: 'クリニック内観' },
    doctorPhoto: { width: 400, height: 400, label: '医師写真' },
    structure: { width: 1200, height: 800, label: 'All-on-4構造図' },
    process: { width: 1000, height: 2000, label: '治療プロセス図' },
    beforeAfter: { width: 1200, height: 400, label: 'ビフォーアフター' },
    columnFeatured: { width: 1200, height: 630, label: 'コラムアイキャッチ' },
    columnContent: { width: 800, height: 600, label: 'コラム内画像' },
    glossaryDiagram: { width: 800, height: 600, label: '用語説明図' },
    featureIcon: { width: 200, height: 200, label: '特徴アイコン' }
};