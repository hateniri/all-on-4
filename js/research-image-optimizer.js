// 論文系記事用画像の最適化とリサイズ
class ResearchImageOptimizer {
    constructor() {
        this.targetImages = [
            {
                selector: 'img[data-src*="research-papers"]',
                fallback: '/images/columns/research-papers.png',
                alt: 'All-on-4研究論文',
                targetWidth: 600,
                targetHeight: 400
            },
            {
                selector: 'img[data-src*="clinical-evidence"]',
                fallback: '/images/columns/clinical-evidence.png',
                alt: '臨床成績データ',
                targetWidth: 600,
                targetHeight: 400
            },
            {
                selector: 'img[data-src*="complications-management"]',
                fallback: '/images/columns/complications-management.png',
                alt: '合併症管理',
                targetWidth: 600,
                targetHeight: 400
            }
        ];
        this.init();
    }

    init() {
        // DOMが読み込まれてから実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processImages());
        } else {
            this.processImages();
        }
    }

    processImages() {
        this.targetImages.forEach(config => {
            const images = document.querySelectorAll(config.selector);
            images.forEach(img => this.optimizeImage(img, config));
        });
    }

    optimizeImage(img, config) {
        // 画像の読み込みエラー処理
        img.onerror = () => {
            console.log(`Failed to load: ${img.src}, using fallback: ${config.fallback}`);
            img.src = config.fallback;
        };

        // 画像読み込み完了時の処理
        img.onload = () => {
            this.resizeImageIfNeeded(img, config);
            this.addOptimizationStyles(img);
        };

        // data-src から src に変換（lazy loading対応）
        if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
        }

        // fallback画像が存在するか確認
        if (!img.src || img.src.includes('undefined')) {
            img.src = config.fallback;
        }

        // alt属性を確実に設定
        if (!img.alt) {
            img.alt = config.alt;
        }
    }

    resizeImageIfNeeded(img, config) {
        // 自然なサイズを取得
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        if (naturalWidth === 0 || naturalHeight === 0) {
            return; // 画像が読み込まれていない
        }

        // アスペクト比を計算
        const targetRatio = config.targetWidth / config.targetHeight;
        const actualRatio = naturalWidth / naturalHeight;

        // コンテナのサイズに合わせて調整
        const container = img.closest('.card-image');
        if (container) {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            // object-fitで適切な表示を設定
            if (Math.abs(actualRatio - targetRatio) > 0.1) {
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
            } else {
                img.style.objectFit = 'contain';
            }

            // 高解像度対応
            if (window.devicePixelRatio > 1) {
                img.style.imageRendering = 'crisp-edges';
            }
        }
    }

    addOptimizationStyles(img) {
        // 読み込み完了を示すクラスを追加
        img.classList.add('research-image-loaded');
        
        // スムーズな表示のためのトランジション
        img.style.transition = 'opacity 0.3s ease-in-out';
        img.style.opacity = '1';

        // 親要素にも読み込み完了を通知
        const card = img.closest('.article-card');
        if (card) {
            card.classList.add('image-ready');
        }
    }

    // 画像の事前読み込み（パフォーマンス向上）
    preloadImages() {
        this.targetImages.forEach(config => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = config.fallback;
            document.head.appendChild(link);
        });
    }

    // 画像の品質チェック
    checkImageQuality(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            try {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // 簡単な品質指標（色の多様性）
                const colors = new Set();
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
                    colors.add(`${r},${g},${b}`);
                }
                
                const quality = colors.size / (canvas.width * canvas.height);
                resolve(quality);
            } catch (e) {
                resolve(0.5); // デフォルト値
            }
        });
    }
}

// WebP対応チェック
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// 画像形式の最適化
async function optimizeImageFormat() {
    const supportsWebp = await supportsWebP();
    
    if (supportsWebp) {
        // WebP対応ブラウザの場合、可能であればWebPを使用
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.dataset.src;
            if (src && src.includes('.png')) {
                const webpSrc = src.replace('.png', '.webp');
                
                // WebP版が存在するかチェック
                const testImg = new Image();
                testImg.onload = () => {
                    img.dataset.src = webpSrc;
                };
                testImg.src = webpSrc;
            }
        });
    }
}

// レスポンシブ画像の設定
function setupResponsiveImages() {
    const images = document.querySelectorAll('.article-card img');
    
    images.forEach(img => {
        // 画面サイズに応じて画像サイズを調整
        const updateImageSize = () => {
            const cardWidth = img.closest('.article-card').offsetWidth;
            
            if (cardWidth < 300) {
                img.style.width = '100%';
                img.style.height = '150px';
            } else if (cardWidth < 400) {
                img.style.width = '100%';
                img.style.height = '180px';
            } else {
                img.style.width = '100%';
                img.style.height = '200px';
            }
        };
        
        updateImageSize();
        window.addEventListener('resize', updateImageSize);
    });
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // 画像最適化を開始
    const optimizer = new ResearchImageOptimizer();
    
    // 画像を事前読み込み
    optimizer.preloadImages();
    
    // 画像形式を最適化
    optimizeImageFormat();
    
    // レスポンシブ画像を設定
    setupResponsiveImages();
    
    // 遅延読み込みの処理
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});