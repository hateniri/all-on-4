// Hospital Filter Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter UI
    const filterContainer = document.getElementById('hospital-filters');
    if (!filterContainer) return;
    
    // Create filter controls
    const filterHTML = `
        <div class="filter-controls">
            <h3>絞り込み検索</h3>
            
            <div class="filter-group">
                <label>地域で絞り込み</label>
                <select id="region-filter" class="filter-select">
                    <option value="">すべての地域</option>
                    <option value="東京都">東京都</option>
                    <option value="神奈川県">神奈川県</option>
                    <option value="大阪府">大阪府</option>
                    <option value="愛知県">愛知県</option>
                    <option value="福岡県">福岡県</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label>対応サービス</label>
                <div class="filter-checkboxes">
                    <label class="checkbox-label">
                        <input type="checkbox" id="filter-zirconia" value="zirconia">
                        <span>ジルコニア対応</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="filter-sedation" value="sedation">
                        <span>静脈内鎮静法</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="filter-zygoma" value="zygoma">
                        <span>ザイゴマインプラント</span>
                    </label>
                </div>
            </div>
            
            <div class="filter-group">
                <label>評価で絞り込み</label>
                <select id="rating-filter" class="filter-select">
                    <option value="">すべての評価</option>
                    <option value="4.5">★4.5以上</option>
                    <option value="4.0">★4.0以上</option>
                    <option value="3.5">★3.5以上</option>
                </select>
            </div>
            
            <button id="reset-filters" class="btn-secondary">絞り込みをリセット</button>
        </div>
    `;
    
    filterContainer.innerHTML = filterHTML;
    
    // Hospital data (would normally come from the YAML file)
    const hospitals = window.hospitalData || [];
    
    // Filter function
    function filterHospitals() {
        const regionFilter = document.getElementById('region-filter').value;
        const zirconiaFilter = document.getElementById('filter-zirconia').checked;
        const sedationFilter = document.getElementById('filter-sedation').checked;
        const zygomaFilter = document.getElementById('filter-zygoma').checked;
        const ratingFilter = parseFloat(document.getElementById('rating-filter').value) || 0;
        
        const hospitalCards = document.querySelectorAll('.hospital-card');
        let visibleCount = 0;
        
        hospitalCards.forEach(card => {
            const hospital = card.dataset;
            let show = true;
            
            // Region filter
            if (regionFilter && hospital.region !== regionFilter) {
                show = false;
            }
            
            // Service filters
            if (zirconiaFilter && hospital.zirconia !== 'true') {
                show = false;
            }
            if (sedationFilter && hospital.sedation !== 'true') {
                show = false;
            }
            if (zygomaFilter && hospital.zygoma !== 'true') {
                show = false;
            }
            
            // Rating filter
            if (ratingFilter && parseFloat(hospital.rating) < ratingFilter) {
                show = false;
            }
            
            // Show/hide card
            if (show) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        updateResultsCount(visibleCount);
    }
    
    // Update results count
    function updateResultsCount(count) {
        let resultsElement = document.getElementById('filter-results');
        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.id = 'filter-results';
            resultsElement.className = 'filter-results';
            filterContainer.appendChild(resultsElement);
        }
        
        resultsElement.textContent = `${count}件の医院が見つかりました`;
    }
    
    // Reset filters
    function resetFilters() {
        document.getElementById('region-filter').value = '';
        document.getElementById('filter-zirconia').checked = false;
        document.getElementById('filter-sedation').checked = false;
        document.getElementById('filter-zygoma').checked = false;
        document.getElementById('rating-filter').value = '';
        filterHospitals();
    }
    
    // Event listeners
    document.getElementById('region-filter').addEventListener('change', filterHospitals);
    document.getElementById('filter-zirconia').addEventListener('change', filterHospitals);
    document.getElementById('filter-sedation').addEventListener('change', filterHospitals);
    document.getElementById('filter-zygoma').addEventListener('change', filterHospitals);
    document.getElementById('rating-filter').addEventListener('change', filterHospitals);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Initial filter
    filterHospitals();
});

// Add CSS for filter UI
const filterStyles = `
<style>
.filter-controls {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.filter-controls h3 {
    margin-bottom: 1.5rem;
    color: #333;
}

.filter-group {
    margin-bottom: 1.5rem;
}

.filter-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
}

.filter-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
}

.filter-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    font-weight: normal;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    margin-right: 0.5rem;
}

#reset-filters {
    width: 100%;
    padding: 0.75rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

#reset-filters:hover {
    background: #5a6268;
}

.filter-results {
    margin-top: 1rem;
    padding: 1rem;
    background: #e9ecef;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
}

@media (min-width: 768px) {
    .filter-controls {
        position: sticky;
        top: 80px;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', filterStyles);