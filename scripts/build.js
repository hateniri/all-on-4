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

// Generate region pages
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
                        <h2>${h.name}</h2>
                        <p class="address">${h.address}</p>
                        <p class="features">
                            ${h.allon4 ? '✓ All-on-4対応' : ''}
                            ${h.zirconia ? '✓ ジルコニア対応' : ''}
                            ${h.sedation ? '✓ 静脈内鎮静法対応' : ''}
                        </p>
                        <p class="rating">評価: ⭐${h.stars} (${h.review_count}件のレビュー)</p>
                        <p class="comment">${h.comment}</p>
                        <a href="${h.website}" target="_blank" rel="noopener" class="btn-link">公式サイトへ</a>
                        ${fs.existsSync(path.join(__dirname, '..', 'reviews', `${h.id}.md`)) ? 
                            `<a href="/reviews/${h.id}.html" class="btn-link">詳細レビューを見る</a>` : ''}
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
</body>
</html>`;

    fs.writeFileSync(path.join(hospitalsDistDir, `${regionSlug}.html`), html);
});

console.log('Build completed successfully!');