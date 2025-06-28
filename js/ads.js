// 広告管理システム
const ads = [
    {
        id: 'premium-sale',
        image: '/images/ads/premium-sale.gif',
        link: 'https://www.amazon.co.jp/primeday?_encoding=UTF8&pf_rd_p=5064d9a1-ba74-45e0-98dc-93a743d6432b&pf_rd_r=02HX98VVXGKEYFA83T0F&linkCode=ll2&tag=guildarts-22&linkId=1f030d6796c9e66d75a598ea9acf376f&language=ja_JP&ref_=as_li_ss_tl',
        alt: 'Amazonプレミアムセール',
        width: 1500,
        height: 150,
        type: 'banner'
    },
    {
        id: 'furusato-hero',
        image: '/images/ads/furusato-hero.jpg',
        link: 'https://www.amazon.co.jp/fmc/furusato/special/seasonal_foods?pf_rd_r=QM1P72BWZZC94WAHPBB2&pf_rd_p=302f4a7f-1fbc-4fcd-a750-3843d3ddf94f&pf_rd_m=AN1VRQENFRJN5&pf_rd_s=fresh-merchandised-content-6&pf_rd_t=&pf_rd_i=111111&linkCode=ll2&tag=guildarts-22&linkId=d18e4bbc4f26431ecb5547ef98a25e1c&language=ja_JP&ref_=as_li_ss_tl',
        alt: 'ふるさと納税',
        width: 1500,
        height: 300,
        type: 'hero'
    },
    {
        id: 'furusato-food',
        image: '/images/ads/furusato-food.jpg',
        link: 'https://www.amazon.co.jp/fmc/furusato/special/seasonal_foods?pf_rd_r=QM1P72BWZZC94WAHPBB2&pf_rd_p=302f4a7f-1fbc-4fcd-a750-3843d3ddf94f&pf_rd_m=AN1VRQENFRJN5&pf_rd_s=fresh-merchandised-content-6&pf_rd_t=&pf_rd_i=111111&linkCode=ll2&tag=guildarts-22&linkId=d18e4bbc4f26431ecb5547ef98a25e1c&language=ja_JP&ref_=as_li_ss_tl',
        alt: 'ふるさと納税 グルメ特集',
        width: 1500,
        height: 300,
        type: 'hero'
    },
    {
        id: 'audible',
        image: '/images/ads/audible-banner.jpg',
        link: 'https://www.amazon.co.jp/Audible-%E3%82%AA%E3%83%BC%E3%83%87%E3%82%A3%E3%82%AA%E3%83%96%E3%83%83%E3%82%AF/b?ie=UTF8&node=7471076051&linkCode=ll2&tag=guildarts-22&linkId=813b3d8aa271b290d074f66dbae60423&language=ja_JP&ref_=as_li_ss_tl',
        alt: 'Audible オーディオブック',
        width: 1000,
        height: 120,
        type: 'banner'
    }
];

// ランダムに広告を選択
function getRandomAd(type = null) {
    let filteredAds = ads;
    if (type) {
        filteredAds = ads.filter(ad => ad.type === type);
    }
    return filteredAds[Math.floor(Math.random() * filteredAds.length)];
}

// 広告を表示
function displayAds() {
    const adSections = document.querySelectorAll('.ad-section');
    
    adSections.forEach((section) => {
        const placeholder = section.querySelector('.ad-placeholder');
        if (placeholder) {
            const ad = getRandomAd();
            
            // 広告HTMLを作成
            const adHTML = `
                <a href="${ad.link}" target="_blank" rel="nofollow noopener sponsored" class="ad-link">
                    <img src="${ad.image}" 
                         alt="${ad.alt}" 
                         width="${ad.width}" 
                         height="${ad.height}"
                         loading="lazy"
                         class="ad-image">
                </a>
            `;
            
            placeholder.innerHTML = adHTML;
        }
    });
    
    // 特定の広告スペース用
    const heroAdSections = document.querySelectorAll('.hero-ad-section');
    heroAdSections.forEach((section) => {
        const placeholder = section.querySelector('.ad-placeholder');
        if (placeholder) {
            const ad = getRandomAd('hero');
            const adHTML = `
                <a href="${ad.link}" target="_blank" rel="nofollow noopener sponsored" class="ad-link">
                    <img src="${ad.image}" 
                         alt="${ad.alt}" 
                         width="${ad.width}" 
                         height="${ad.height}"
                         loading="lazy"
                         class="ad-image">
                </a>
            `;
            placeholder.innerHTML = adHTML;
        }
    });
}

// ページ読み込み時に広告を表示
document.addEventListener('DOMContentLoaded', displayAds);