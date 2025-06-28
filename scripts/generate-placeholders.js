const fs = require('fs');
const path = require('path');

// プレースホルダー画像を生成する関数
function createPlaceholderSVG(width, height, text) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#cccccc"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#666666">
            ${width}x${height}
        </text>
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666666">
            ${text}
        </text>
    </svg>`;
}

// 画像リスト
const placeholders = [
    // ヒーロー画像
    { filename: 'hero-all-on-4.svg', width: 1920, height: 600, text: 'All-on-4 Hero Image' },
    
    // コラム用画像
    { filename: 'column-what-is-all-on-4.svg', width: 800, height: 450, text: 'All-on-4 Illustration' },
    { filename: 'column-zirconia-experience.svg', width: 800, height: 450, text: 'Zirconia Example' },
    { filename: 'column-implant-failure.svg', width: 800, height: 450, text: 'Implant X-ray' },
    { filename: 'column-oral-care-goods.svg', width: 800, height: 450, text: 'Oral Care Products' },
    { filename: 'column-psychology.svg', width: 800, height: 450, text: 'Patient Portrait' },
    
    // 病院画像
    { filename: 'hospital-tokyo-premium.svg', width: 600, height: 400, text: 'Tokyo Premium Implant' },
    { filename: 'hospital-ginza-oral.svg', width: 600, height: 400, text: 'Ginza Oral Clinic' },
    { filename: 'hospital-shinjuku-center.svg', width: 600, height: 400, text: 'Shinjuku Implant Center' },
    { filename: 'hospital-yokohama-minato.svg', width: 600, height: 400, text: 'Yokohama Minato Implant' },
    { filename: 'hospital-shonan-dental.svg', width: 600, height: 400, text: 'Shonan Dental Clinic' },
    { filename: 'hospital-osaka-umeda.svg', width: 600, height: 400, text: 'Osaka Umeda Center' },
    { filename: 'hospital-namba-oral.svg', width: 600, height: 400, text: 'Namba Oral Care' },
    { filename: 'hospital-nagoya-central.svg', width: 600, height: 400, text: 'Nagoya Central Implant' },
    { filename: 'hospital-hakata-implant.svg', width: 600, height: 400, text: 'Hakata Implant Clinic' },
    { filename: 'hospital-tenjin-dental.svg', width: 600, height: 400, text: 'Tenjin Dental Implant' },
    
    // 治療プロセス画像
    { filename: 'process-consultation.svg', width: 400, height: 300, text: 'Consultation' },
    { filename: 'process-surgery.svg', width: 400, height: 300, text: 'Surgery' },
    { filename: 'process-recovery.svg', width: 400, height: 300, text: 'Recovery' },
    { filename: 'process-final.svg', width: 400, height: 300, text: 'Final Result' },
    
    // アイコン・その他
    { filename: 'icon-all-on-4.svg', width: 200, height: 200, text: 'All-on-4 Icon' },
    { filename: 'icon-zirconia.svg', width: 200, height: 200, text: 'Zirconia Icon' },
    { filename: 'icon-sedation.svg', width: 200, height: 200, text: 'Sedation Icon' },
    { filename: 'icon-warranty.svg', width: 200, height: 200, text: 'Warranty Icon' },
    
    // Before/After
    { filename: 'before-after-case1.svg', width: 800, height: 400, text: 'Before/After Case 1' },
    { filename: 'before-after-case2.svg', width: 800, height: 400, text: 'Before/After Case 2' },
    { filename: 'before-after-case3.svg', width: 800, height: 400, text: 'Before/After Case 3' },
];

// 画像を生成
const imagesDir = path.join(__dirname, '..', 'images');

placeholders.forEach(placeholder => {
    const svg = createPlaceholderSVG(placeholder.width, placeholder.height, placeholder.text);
    const filepath = path.join(imagesDir, placeholder.filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${placeholder.filename}`);
});

console.log(`\nTotal ${placeholders.length} placeholder images created in /images directory.`);