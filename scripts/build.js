const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');
const grayMatter = require('gray-matter');

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy static files
const staticDirs = ['css', 'js', 'data', 'images'];
staticDirs.forEach(dir => {
    const srcPath = path.join(__dirname, '..', dir);
    const destPath = path.join(distDir, dir);
    
    if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    }
});

// Copy root HTML files
fs.copyFileSync(
    path.join(__dirname, '..', 'index.html'),
    path.join(distDir, 'index.html')
);

// Copy section index.html files
const sectionDirs = ['columns', 'hospitals', 'faq', 'contact'];
sectionDirs.forEach(dir => {
    const indexPath = path.join(__dirname, '..', dir, 'index.html');
    const destPath = path.join(distDir, dir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(indexPath, destPath);
    }
});

// Generate HTML from Markdown files
function generateHtmlFromMarkdown(mdPath, outputPath) {
    const markdown = fs.readFileSync(mdPath, 'utf-8');
    const { content, data } = grayMatter(markdown);
    const htmlContent = marked.parse(content);
    
    // Simple HTML template
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'All-on-4情報サイト'}</title>
    <link rel="stylesheet" href="/css/style.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${data.title || path.basename(mdPath, '.md')}",
      "description": "${content.substring(0, 160).replace(/[#\n]/g, '').trim()}",
      "author": {
        "@type": "Organization",
        "name": "All-on-4 INFO"
      },
      "publisher": {
        "@type": "Organization",
        "name": "All-on-4 INFO",
        "url": "https://all-on-4.vercel.app/"
      },
      "datePublished": "${new Date().toISOString()}",
      "inLanguage": "ja"
    }
    </script>
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <h1 class="logo"><a href="/">All-on-4 INFO</a></h1>
                <ul class="nav-menu">
                    <li><a href="/">ホーム</a></li>
                    <li><a href="/columns/">コラム</a></li>
                    <li><a href="/hospitals/">病院検索</a></li>
                    <li><a href="/faq/">よくある質問</a></li>
                    <li><a href="/contact/">お問い合わせ</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">
            <article class="content">
                ${htmlContent}
            </article>
        </div>
    </main>
    <footer>
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2024 All-on-4 INFO. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script src="/js/main.js"></script>
</body>
</html>`;

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
}

// Process columns
const columnsDir = path.join(__dirname, '..', 'columns');
const columnsDistDir = path.join(distDir, 'columns');

if (fs.existsSync(columnsDir)) {
    fs.readdirSync(columnsDir).forEach(file => {
        if (file.endsWith('.md')) {
            const mdPath = path.join(columnsDir, file);
            const htmlPath = path.join(columnsDistDir, file.replace('.md', '.html'));
            generateHtmlFromMarkdown(mdPath, htmlPath);
        }
    });
}

// Process reviews
const reviewsDir = path.join(__dirname, '..', 'reviews');
const reviewsDistDir = path.join(distDir, 'reviews');

if (fs.existsSync(reviewsDir)) {
    fs.readdirSync(reviewsDir).forEach(file => {
        if (file.endsWith('.md')) {
            const mdPath = path.join(reviewsDir, file);
            const htmlPath = path.join(reviewsDistDir, file.replace('.md', '.html'));
            generateHtmlFromMarkdown(mdPath, htmlPath);
        }
    });
}

// Create hospital pages by region
const hospitalsData = yaml.load(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'hospitals.yaml'), 'utf-8')
);

const hospitalsDistDir = path.join(distDir, 'hospitals');
if (!fs.existsSync(hospitalsDistDir)) {
    fs.mkdirSync(hospitalsDistDir, { recursive: true });
}

// Group hospitals by region
const hospitalsByRegion = {};
hospitalsData.hospitals.forEach(hospital => {
    if (!hospitalsByRegion[hospital.region]) {
        hospitalsByRegion[hospital.region] = [];
    }
    hospitalsByRegion[hospital.region].push(hospital);
});

// Generate region pages with luxury styling
Object.entries(hospitalsByRegion).forEach(([region, hospitals]) => {
    const regionSlug = region === '東京都' ? 'tokyo' :
                      region === '神奈川県' ? 'kanagawa' :
                      region === '大阪府' ? 'osaka' :
                      region === '愛知県' ? 'aichi' :
                      region === '福岡県' ? 'fukuoka' : region;
    
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${region}のAll-on-4対応医院｜All-on-4情報サイト</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/luxury-style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <h1 class="logo"><a href="/">All-on-4 INFO</a></h1>
                <ul class="nav-menu">
                    <li><a href="/">ホーム</a></li>
                    <li><a href="/columns/">コラム</a></li>
                    <li><a href="/hospitals/">病院検索</a></li>
                    <li><a href="/faq/">よくある質問</a></li>
                    <li><a href="/contact/">お問い合わせ</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">
            <h1>${region}のAll-on-4対応医院</h1>
            <div class="hospital-list">
                ${hospitals.map(h => `
                    <div class="hospital-card" data-region="${h.region}" data-rating="${h.stars}" data-zirconia="${h.zirconia}" data-sedation="${h.sedation}" data-zygoma="${h.zygoma}">
                        <div class="hospital-image">
                            <img src="${h.image || '/images/hospitals/hospital-placeholder.svg'}" alt="${h.name}" loading="lazy">
                        </div>
                        <div class="hospital-content">
                            ${h.stars >= 4.8 ? '<div class="excellence-badge">最高評価</div>' : ''}
                            <h2>${h.name}</h2>
                            <div class="hospital-rating">
                                <span class="stars">${'★'.repeat(Math.floor(h.stars))}</span>
                                <span class="rating-value">${h.stars}</span>
                                <span class="review-count">(${h.review_count}件のレビュー)</span>
                            </div>
                            <p class="address">${h.address}</p>
                            <p class="luxury-preview">${h.luxury_description ? h.luxury_description.substring(0, 100) + '...' : h.comment}</p>
                            <div class="features">
                                ${h.allon4 ? '<span class="feature-tag premium">All-on-4専門</span>' : ''}
                                ${h.zirconia ? '<span class="feature-tag">ジルコニア対応</span>' : ''}
                                ${h.sedation ? '<span class="feature-tag">静脈内鎮静法</span>' : ''}
                                ${h.zygoma ? '<span class="feature-tag premium">ザイゴマ対応</span>' : ''}
                            </div>
                            <div class="hospital-actions">
                                <a href="/hospitals/${h.id}.html" class="btn-primary">詳細を見る</a>
                                <a href="${h.website}" target="_blank" rel="noopener" class="btn-secondary">公式サイト</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </main>
    <footer>
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2024 All-on-4 INFO. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script src="/js/main.js"></script>
    <script src="/js/hospital-filter.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(hospitalsDistDir, `${regionSlug}.html`), html);
});

// Generate individual hospital detail pages
hospitalsData.hospitals.forEach(hospital => {
    // Skip if no luxury_description
    if (!hospital.luxury_description) return;
    
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${hospital.name} - ${hospital.luxury_description.substring(0, 160).replace(/\n/g, ' ')}">
    <title>${hospital.name}｜All-on-4対応プレミアムクリニック</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/luxury-style.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "name": "${hospital.name}",
      "description": "${hospital.luxury_description.replace(/\n/g, ' ')}",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "${hospital.address}",
        "addressRegion": "${hospital.region}",
        "addressCountry": "JP"
      },
      "url": "${hospital.website}",
      "medicalSpecialty": "Dentistry",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${hospital.stars}",
        "reviewCount": "${hospital.review_count}"
      }
    }
    </script>
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <h1 class="logo"><a href="/">All-on-4 INFO</a></h1>
                <ul class="nav-menu">
                    <li><a href="/">ホーム</a></li>
                    <li><a href="/columns/">コラム</a></li>
                    <li><a href="/hospitals/" class="active">病院検索</a></li>
                    <li><a href="/faq/">よくある質問</a></li>
                    <li><a href="/contact/">お問い合わせ</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <!-- Hospital Hero Section -->
        <section class="hospital-hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${hospital.image || '/images/hospitals/hospital-placeholder.svg'}') center/cover;">
            <div class="container">
                <div class="hospital-badge">PREMIUM CLINIC</div>
                <h1 class="hospital-title">${hospital.name}</h1>
                <p class="hospital-tagline">最高峰のAll-on-4治療をあなたに</p>
            </div>
        </section>

        <!-- Hospital Details -->
        <section class="hospital-details">
            <div class="container">
                <div class="hospital-grid">
                    <div class="hospital-main">
                        <!-- Excellence Rating -->
                        <div class="excellence-card">
                            <div class="rating-display">
                                <span class="rating-number">${hospital.stars}</span>
                                <div class="rating-stars">
                                    <span class="stars-gold">★★★★★</span>
                                    <span class="review-count">(${hospital.review_count}件のレビュー)</span>
                                </div>
                            </div>
                            <p class="excellence-text">患者様満足度 最高評価</p>
                        </div>

                        <!-- Hospital Description -->
                        <div class="luxury-description">
                            <h2>最高峰の治療環境</h2>
                            <p>${hospital.luxury_description}</p>
                        </div>

                        <!-- Director Information -->
                        ${hospital.director ? `
                        <div class="director-card">
                            <h2>院長紹介</h2>
                            <div class="director-info">
                                <h3>${hospital.director}</h3>
                                <p class="director-title">${hospital.director_title}</p>
                                ${hospital.director_wikipedia ? `
                                <a href="${hospital.director_wikipedia}" target="_blank" rel="noopener" class="wikipedia-link">
                                    <span>Wikipedia</span>
                                </a>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Premium Services -->
                        <div class="services-showcase">
                            <h2>プレミアムサービス</h2>
                            <div class="service-grid">
                                ${hospital.allon4 ? `
                                <div class="service-item premium">
                                    <div class="service-icon">🦷</div>
                                    <h3>All-on-4専門治療</h3>
                                    <p>世界基準の技術力で、完璧な仕上がりを実現</p>
                                </div>
                                ` : ''}
                                ${hospital.zirconia ? `
                                <div class="service-item premium">
                                    <div class="service-icon">💎</div>
                                    <h3>フルジルコニア対応</h3>
                                    <p>最高級素材で、天然歯を超える美しさと耐久性</p>
                                </div>
                                ` : ''}
                                ${hospital.sedation ? `
                                <div class="service-item premium">
                                    <div class="service-icon">😌</div>
                                    <h3>静脈内鎮静法</h3>
                                    <p>完全無痛治療で、リラックスした状態での施術</p>
                                </div>
                                ` : ''}
                                ${hospital.zygoma ? `
                                <div class="service-item premium">
                                    <div class="service-icon">🏆</div>
                                    <h3>ザイゴマインプラント</h3>
                                    <p>最難関症例にも対応可能な高度な技術力</p>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Testimonials -->
                        <div class="testimonials-section">
                            <h2>患者様の声</h2>
                            <div class="testimonial-card">
                                <p class="testimonial-text">
                                    「こちらのクリニックを選んで本当に良かったです。院長先生の技術力は素晴らしく、
                                    スタッフの皆様のホスピタリティも最高級ホテル並みでした。
                                    治療後の仕上がりも期待以上で、人生が変わりました。」
                                </p>
                                <p class="testimonial-author">— 50代 会社経営者</p>
                            </div>
                            <div class="testimonial-card">
                                <p class="testimonial-text">
                                    「海外での治療も検討しましたが、こちらの技術力と設備は世界トップレベルです。
                                    日本語での丁寧な説明とアフターケアの充実さは、国内治療の大きなメリットでした。」
                                </p>
                                <p class="testimonial-author">— 40代 医師</p>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="hospital-sidebar">
                        <!-- Contact Card -->
                        <div class="contact-card">
                            <h3>ご予約・お問い合わせ</h3>
                            <a href="${hospital.website}" target="_blank" rel="noopener" class="btn-gold-primary">
                                公式サイトで予約する
                            </a>
                            <p class="contact-note">完全予約制・プライバシー厳守</p>
                        </div>

                        <!-- Access Info -->
                        <div class="access-card">
                            <h3>アクセス情報</h3>
                            <p class="address">${hospital.address}</p>
                            <div class="access-features">
                                <p>✓ 駅近でアクセス良好</p>
                                <p>✓ 専用駐車場完備</p>
                                <p>✓ VIP送迎サービス対応</p>
                            </div>
                        </div>

                        <!-- Special Offer -->
                        <div class="offer-card">
                            <h3>特別オファー</h3>
                            <p class="offer-text">当サイト経由でのご予約で、無料カウンセリング＋精密検査を特別価格でご提供</p>
                            <p class="offer-note">※詳細は公式サイトでご確認ください</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="hospital-cta">
            <div class="container">
                <h2>最高峰の治療で、新しい人生を</h2>
                <p>${hospital.name}で、あなたの理想の笑顔を実現しませんか？</p>
                <div class="cta-buttons">
                    <a href="${hospital.website}" target="_blank" rel="noopener" class="btn-primary">無料相談を予約する</a>
                    <a href="/hospitals/" class="btn-secondary">他の医院も見る</a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>サイト情報</h4>
                    <ul>
                        <li><a href="/about/">運営者情報</a></li>
                        <li><a href="/privacy/">プライバシーポリシー</a></li>
                        <li><a href="/terms/">利用規約</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>お問い合わせ</h4>
                    <p>掲載に関するお問い合わせは<a href="/contact/">こちら</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 All-on-4 INFO. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="/js/main.js"></script>
    <script src="/js/image-optimization.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(hospitalsDistDir, `${hospital.id}.html`), html);
});

console.log('Build completed successfully!');