document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupListeners();
});

// --- 1. RENDER CONTENT ---
function loadContent() {
    // Services
    const serviceGrid = document.querySelector('.services-grid');
    if(serviceGrid) serviceGrid.innerHTML = appData.services.map(s => 
        `<div class="service-item"><i class="ph ${s.icon}"></i><p>${s.text}</p></div>`
    ).join('');

    // Pricing
    const pricingGrid = document.querySelector('.pricing-grid');
    if(pricingGrid) pricingGrid.innerHTML = appData.pricing.map(item => 
        `<div class="price-item">
            <i class="ph ${item.icon}" style="${item.scale ? `transform: scale(${item.scale})` : ''}"></i>
            <span class="price-label">${item.label} ${item.price}</span>
        </div>`
    ).join('');

    // Results Carousel
    const resultsContainer = document.querySelector('.results-carousel');
    if (resultsContainer) {
        if (!appData.results || appData.results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; width:100%;">Add images to data.js</p>';
        } else {
            resultsContainer.innerHTML = appData.results.map(img => `
                <div class="result-card">
                    <div class="result-img-wrapper">
                        <img src="${img.src}" alt="${img.caption}" class="result-img">
                    </div>
                    <div class="result-caption">${img.caption}</div>
                </div>
            `).join('');
            startAutoScroll('.results-carousel');
        }
    }

    // Reviews
    const reviewsTrack = document.querySelector('.reviews-track');
    if (reviewsTrack) {
        reviewsTrack.innerHTML = appData.reviews.map(r => `
            <div class="review-card">
                <div class="stars">★★★★★</div>
                <p class="review-text">"${r.text}"</p>
                <div class="review-meta">
                    <strong>${r.name}</strong> • ${r.source}
                </div>
            </div>
        `).join('');
    }
    
    // Footer Links
    if(appData.socials) {
        const gl = document.getElementById('link-google');
        const nl = document.getElementById('link-nextdoor');
        const il = document.getElementById('link-instagram');
        
        if(gl) gl.href = appData.socials.google || "#";
        if(nl) nl.href = appData.socials.nextdoor || "#";
        if(il) il.href = appData.socials.instagram || "#";
    }
}

// --- 2. ZIP ROUTE LOGIC ---

// Anchor Date: Monday, March 3, 2025 (Week 1 Start)
const ANCHOR_DATE = new Date('2025-03-03T00:00:00'); 
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getNextPickupDate(zip) {
    if (!appData.zipRouteMap.hasOwnProperty(zip)) {
        return null;
    }
    
    const routeData = appData.zipRouteMap[zip];
    const targetDayName = routeData.routeDay;
    const targetWeek = routeData.week;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const oneDay = 24 * 60 * 60 * 1000;

    let checkDate = new Date(today);
    
    // Scan up to 21 days ahead
    for(let i = 0; i < 21; i++) {
        const currentDayName = DAY_NAMES[checkDate.getDay()];
        
        if (currentDayName === targetDayName) {
            // Logic to determine if this date is Week 1 or Week 2 relative to Anchor
            const dayOfWeek = checkDate.getDay(); // Sun=0, Mon=1...
            // Calculate the Monday of the current checkDate's week
            const distToMon = (dayOfWeek + 6) % 7; 
            const mondayOfThisWeek = new Date(checkDate);
            mondayOfThisWeek.setDate(checkDate.getDate() - distToMon);
            mondayOfThisWeek.setHours(0,0,0,0);
            
            // Weeks diff from anchor
            const weeksDiff = Math.round((mondayOfThisWeek - ANCHOR_DATE) / (7 * oneDay));
            
            // Even weeks = Week 1, Odd weeks = Week 2
            const calculatedWeek = (weeksDiff % 2 === 0) ? 1 : 2;
            
            if (calculatedWeek === targetWeek) {
                return checkDate;
            }
        }
        checkDate.setDate(checkDate.getDate() + 1);
    }
    return null;
}

function handleZipSearch() {
    const zipInput = document.getElementById('zipInput');
    const resultDiv = document.getElementById('zipResult');
    const zip = zipInput.value.trim();
    
    resultDiv.style.display = 'none';
    resultDiv.className = 'zip-result';
    
    if (zip.length !== 5 || isNaN(zip)) {
        resultDiv.innerHTML = "Please enter a valid 5-digit ZIP code.";
        resultDiv.className = 'zip-result error';
        resultDiv.style.display = 'block';
        return;
    }
    
    const nextDate = getNextPickupDate(zip);
    
    if (nextDate) {
        // SUCCESS CASE
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateStr = nextDate.toLocaleDateString('en-US', options);
        
        // Note: Changed "Text me" to "Text us"
        resultDiv.innerHTML = `
            <p class="success-msg">We’re coming to your area on <strong>${dateStr}</strong>.</p>
            <p style="margin-top:10px; font-size:0.95rem;">
                <a href="#" class="text-link" onclick="bookRoute('${zip}', '${dateStr}')">Text us</a> to reserve your pickup for that day.
            </p>
        `;
        resultDiv.className = 'zip-result success';
        resultDiv.style.display = 'block';
    } else {
        // ERROR/NOT FOUND CASE (Updated Copy & Link)
        resultDiv.innerHTML = `
            We don’t currently run a route in your area (${zip}), but 
            <a href="#" class="text-link" onclick="manualText('${zip}')">text us</a> and we will find a way to accommodate.
        `;
        resultDiv.className = 'zip-result error';
        resultDiv.style.display = 'block';
    }
}

// --- 3. SMS LOGIC (Consolidated & Fixed) ---

// Helper function to launch SMS on any device
function launchSMS(messageBody) {
    // 1. Get raw number and strip EVERYTHING except digits
    // e.g. "000-000-0000" -> "0000000000"
    const rawPhone = appData.business.phone.replace(/[^0-9]/g, ''); 
    
    // 2. Encode the message text safely
    const msg = encodeURIComponent(messageBody);
    
    // 3. Detect Device for correct separator (? vs &)
    const ua = navigator.userAgent.toLowerCase();
    const isIOSorMac = /iphone|ipad|ipod|macintosh/.test(ua);
    
    let url = "";
    if (isIOSorMac) {
        url = `sms:${rawPhone}&body=${msg}`;
    } else {
        url = `sms:${rawPhone}?body=${msg}`;
    }

    console.log("Launching SMS:", url); // Debugging
    window.location.href = url;
}

// Function 1: Route Success Text ("Text us to reserve")
window.bookRoute = function(zip, date) {
    const msg = appData.messages.routeBooking
        .replace('[ZIP CODE]', zip)
        .replace('[DATE]', date);
    launchSMS(msg);
}

// Function 2: Manual Text for Unknown ZIP ("Text us to accommodate")
window.manualText = function(zip) {
    const msg = `Hi Sharp Mom! I live in ${zip}. I see you don't have a route here yet, but I'd like to schedule a sharpening.`;
    launchSMS(msg);
}

// --- 4. EVENT LISTENERS ---
function setupListeners() {
    // ZIP Button
    const findBtn = document.getElementById('findDayBtn');
    if(findBtn) findBtn.addEventListener('click', handleZipSearch);
    
    const zipIn = document.getElementById('zipInput');
    if(zipIn) {
        zipIn.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleZipSearch();
        });
    }

    // Doorstep Link (House Call)
    const doorBtn = document.getElementById('doorstep-link');
    if(doorBtn) {
        doorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            launchSMS(appData.messages.doorstepBooking);
        });
    }
    
    // Fallback for any other booking triggers
    const bookingTriggers = document.querySelectorAll('.booking-trigger');
    bookingTriggers.forEach(btn => {
        if (!btn.onclick) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // This handles generic buttons, specific ones use onclick attributes
                launchSMS(appData.messages.doorstepBooking);
            });
        }
    });
}

// --- 5. AUTO SCROLL ---
function startAutoScroll(selector) {
    const track = document.querySelector(selector);
    if (!track) return;
    let direction = 1;
    let isPaused = false;
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);
    setInterval(() => {
        if (!isPaused) {
            track.scrollLeft += direction; 
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
                 track.scrollLeft = 0; 
            }
        }
    }, 30);
}