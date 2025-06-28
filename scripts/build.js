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
    <link rel="stylesheet" href="/css/luxury-style.css">
    
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
        <!-- Article Hero -->
        <section class="article-hero">
            <div class="container">
                <h1 class="article-title">${data.title || path.basename(mdPath, '.md')}</h1>
                <div class="article-meta-hero">
                    <span class="article-category">${data.category || 'コラム'}</span>
                    <span class="article-date">${new Date().toLocaleDateString('ja-JP')}</span>
                </div>
            </div>
        </section>
        
        <div class="container">
            <article class="article-content-luxury">
                ${htmlContent}
            </article>
        </div>
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
                    <p>All-on-4に関するご質問は<a href="/contact/">こちら</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 All-on-4 INFO. All rights reserved.</p>
                <p class="footer-message">オールオンフォーで人生が変わった有志による運営</p>
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
                    <div class="hospital-card">
                        <div class="hospital-image">
                            <img src="${h.image || '/images/hospitals/hospital-placeholder.svg'}" alt="${h.name}" loading="lazy">
                        </div>
                        <div class="hospital-content">
                            <h2>${h.name}</h2>
                            <p class="address">${h.address}</p>
                            <p class="description">${h.description ? h.description.replace(/\n/g, ' ').trim() : ''}</p>
                            <div class="hospital-actions">
                                <a href="${h.website}" target="_blank" rel="noopener" class="btn-primary">公式サイト</a>
                                <a href="/contact/" class="btn-secondary">レビュー投稿</a>
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

// Note: Individual hospital detail pages are not generated
// Users should contact hospitals directly for detailed information

console.log('Build completed successfully!');