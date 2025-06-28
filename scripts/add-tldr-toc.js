const fs = require('fs');
const path = require('path');

// TL;DRテンプレート
const tldrTemplates = {
    'what-is-all-on-4.md': 'All-on-4は4本のインプラントで全顎を支える革新的治療法。従来より短期間・低費用で、即日仮歯装着が可能。',
    'zirconia-million-yen-experience.md': 'IT企業経営者が1000万円のAll-on-4治療を体験。最高級ジルコニアで人生の質が劇的向上。投資価値あり。',
    'implant-failure-and-safety.md': 'インプラント失敗の主因は技術不足と検査不備。CTスキャン必須、経験豊富な医師選びが成功の鍵。',
    'oral-care-goods-top10.md': 'All-on-4には専用ケアが必要。電動歯ブラシとウォーターピック併用で年2-3万円の投資が数百万円を守る。',
    'expensive-treatment-psychology.md': '高額治療選択者の7割は「健康への投資」と認識。過去のトラウマ解放と時間価値の重視が決断の鍵。'
};

// 目次を生成する関数
function generateTOC(content) {
    const headings = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        if (line.startsWith('## ') && !line.includes('TL;DR') && !line.includes('目次')) {
            const heading = line.replace('## ', '').trim();
            const anchor = heading.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
            headings.push({ level: 2, text: heading, anchor });
        } else if (line.startsWith('### ')) {
            const heading = line.replace('### ', '').trim();
            const anchor = heading.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
            headings.push({ level: 3, text: heading, anchor });
        }
    });
    
    if (headings.length === 0) return '';
    
    let toc = '\n## 目次\n\n';
    headings.forEach(h => {
        const indent = h.level === 3 ? '  ' : '';
        toc += `${indent}- [${h.text}](#${h.anchor})\n`;
    });
    
    return toc;
}

// ファイルを処理する関数
function processMarkdownFile(filePath, tldr) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // すでにTL;DRがある場合はスキップ
    if (content.includes('## TL;DR')) {
        console.log(`Skipping ${path.basename(filePath)} - already has TL;DR`);
        return;
    }
    
    // タイトルを取得
    const titleMatch = content.match(/^# (.+)$/m);
    if (!titleMatch) return;
    
    const title = titleMatch[0];
    const afterTitle = content.slice(content.indexOf(title) + title.length);
    
    // TL;DRと目次を生成
    const tldrSection = `\n\n## TL;DR\n${tldr}`;
    const tocSection = generateTOC(content);
    
    // 新しいコンテンツを組み立て
    const newContent = title + tldrSection + tocSection + afterTitle;
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${path.basename(filePath)}`);
}

// columnsディレクトリのMarkdownファイルを処理
const columnsDir = path.join(__dirname, '..', 'columns');
fs.readdirSync(columnsDir).forEach(file => {
    if (file.endsWith('.md') && tldrTemplates[file]) {
        const filePath = path.join(columnsDir, file);
        processMarkdownFile(filePath, tldrTemplates[file]);
    }
});

console.log('TL;DR and TOC addition completed!');