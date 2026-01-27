const observerLocation = {
    lat: 0,
    lon: 0,
    isSet: false
};

// Define the celestial bodies we want to track
const celestialBodies = [
    { id: 'Moon', name: 'Moon', type: 'Satellite', baseMag: -12.7, icon: 'moon', color: 'text-blue-100' },
    { id: 'Mars', name: 'Mars', type: 'Planet', baseMag: 1.5, icon: 'orbit', color: 'text-red-400' },
    { id: 'Jupiter', name: 'Jupiter', type: 'Planet', baseMag: -2.9, icon: 'circle-dot', color: 'text-orange-200' },
    { id: 'Saturn', name: 'Saturn', type: 'Planet', baseMag: 0.6, icon: 'layers', color: 'text-yellow-100' },
    { id: 'Polaris', name: 'Polaris', type: 'Star', baseMag: 1.97, icon: 'star', color: 'text-yellow-400' },
    { id: 'Halley', name: "Halley's Comet", type: 'Comet', baseMag: 25.0, icon: 'circle-arrow-out-down-right', color: 'text-cyan-400' }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initGeolocation();
    setInterval(updateDashboard, 1000);
    document.getElementById('refresh-geo').addEventListener('click', initGeolocation);
});

// Request user's geolocation and update the UI
function initGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            observerLocation.lat = position.coords.latitude;
            observerLocation.lon = position.coords.longitude;
            observerLocation.isSet = true;

            // Update UI coordinates
            document.getElementById('user-lat').innerText = observerLocation.lat.toFixed(4) + '°';
            document.getElementById('user-lon').innerText = observerLocation.lon.toFixed(4) + '°';
            
            // Initial call to populate data immediately
            updateDashboard();
        }, (error) => {
            console.error("Error obtaining location:", error);
            document.getElementById('sky-condition').innerText = "Location Access Denied";
        });
    }
}

// Calculates astronomical data and renders cards
function updateDashboard() {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString();

    if (!observerLocation.isSet) return;

    // The Observer needs: Latitude, Longitude, and Elevation (0 for sea level)
    const observer = new Astronomy.Observer(observerLocation.lat, observerLocation.lon, 0);
    const dashboard = document.getElementById('dashboard-grid');
    dashboard.innerHTML = ''; 
    celestialBodies.forEach(body => {
        let horiz;
        const now = new Date();
        const observer = new Astronomy.Observer(observerLocation.lat, observerLocation.lon, 0);

        try {
            if (body.id === 'Polaris') {
                // Polaris is fixed at the North Celestial Pole
                horiz = { altitude: observerLocation.lat, azimuth: 0 }; 
            } else if (body.id === 'Halley') {
                // Simulated coordinates for Halley as it's far out
                horiz = { altitude: -15.0, azimuth: 180 }; 
            } else {
                // Real calculations for Planets and Moon
                const equat = Astronomy.Equator(body.id, now, observer, true, true);
                horiz = Astronomy.Horizon(now, observer, equat.ra, equat.dec, false);
            }

            const isVisible = horiz.altitude > 0;
            const statusText = isVisible ? "Visible" : "Below Horizon";
            const statusColor = isVisible ? "bg-green-500" : "bg-red-500";

            const flicker = isVisible ? (Math.random() * 0.02) : 0;
            const displayMag = (body.baseMag + flicker).toFixed(2);

            const card = `
                <div class="glass-card p-6 rounded-3xl relative overflow-hidden group">
                    <div class="scanline"></div>
                    <div class="flex justify-between items-start mb-6">
                        <div class="p-3 bg-white/5 rounded-xl ${body.color} group-hover:bg-blue-500/20 transition-colors">
                            <i data-lucide="${body.icon}" class="w-6 h-6"></i>
                        </div>
                        <span class="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white border border-white/10">
                            <span class="w-2 h-2 rounded-full ${statusColor} ${isVisible ? 'pulse-green' : ''}"></span>
                            ${statusText}
                        </span>
                    </div>
                    
                    <h3 class="text-2xl font-space font-bold mb-1">${body.name}</h3>
                    <p class="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-6">${body.type}</p>
                    
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div class="flex flex-col">
                            <span class="data-label">Altitude</span>
                            <span class="data-value text-blue-300">${horiz.altitude.toFixed(2)}°</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="data-label">Azimuth</span>
                            <span class="data-value">${horiz.azimuth.toFixed(2)}° ${getCompassDirection(horiz.azimuth)}</span>
                        </div>
                        <div class="flex flex-col col-span-2">
                            <span class="data-label">Apparent Magnitude</span>
                            <span class="data-value text-gray-300 font-mono">${displayMag}</span>
                        </div>
                    </div>
                </div>
            `;
            dashboard.innerHTML += card;
        } catch (e) { 
            console.error(`Error tracking ${body.name}:`, e);
        }
    });
    updateGlobalStats(now, observer);
    lucide.createIcons();
}

// Calculates current Lunar Phase and basic sky quality estimation
function updateGlobalStats(date, observer) {
    // 1. Lunar Phase Calculation
    const moonPhase = Astronomy.MoonPhase(date);
    let phaseName = "";
    if (moonPhase < 45) phaseName = "New Moon";
    else if (moonPhase < 135) phaseName = "First Quarter";
    else if (moonPhase < 225) phaseName = "Full Moon";
    else if (moonPhase < 315) phaseName = "Last Quarter";
    else phaseName = "New Moon";
    
    document.getElementById('lunar-phase').innerText = phaseName;

    // 2. Simple Sky Condition Logic
    const sunEquat = Astronomy.Equator('Sun', date, observer, true, true);
    const sunHoriz = Astronomy.Horizon(date, observer, sunEquat.ra, sunEquat.dec, false);
    
    if (sunHoriz.altitude > -0.83) {
        document.getElementById('sky-condition').innerText = "Daylight - Limited Visibility";
    } else if (sunHoriz.altitude > -18) {
        document.getElementById('sky-condition').innerText = "Twilight - Improving Visibility";
    } else {
        document.getElementById('sky-condition').innerText = "Deep Night - Optimum Visibility";
    }
}

// Utility: Converts azimuth degrees to compass strings
function getCompassDirection(azimuth) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(azimuth / 45) % 8;
    return directions[index];
}
