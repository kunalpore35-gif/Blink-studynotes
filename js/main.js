/* ===========================================================
   Blink - Shared JavaScript (multi-page version)
   =========================================================== */

/* ---------- Floating Particles ---------- */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const equations = ['E=mc²', 'F=ma', '∫', '∂', '∇', 'ℏ', 'ψ', 'λ', 'Ω', '∑', 'π', '√'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = equations[Math.floor(Math.random() * equations.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.fontSize = (Math.random() * 10 + 10) + 'px';
        container.appendChild(particle);
    }
}

/* ---------- Toast ---------- */
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Mobile Menu ---------- */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

/* ---------- Highlight Active Nav Link ---------- */
function highlightActiveNav() {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        if (link.getAttribute('data-page') === page) link.classList.add('active');
    });
}

/* ---------- Motivation Quotes Rotation (home only) ---------- */
const quotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Physics doesn't care about your feelings, it cares about your practice.", author: "Unknown" },
    { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Unknown" }
];

function startQuoteRotation() {
    const quoteEl = document.querySelector('.motivation-quote p');
    const authorEl = document.querySelector('.motivation-quote .author');
    if (!quoteEl || !authorEl) return;

    let quoteIndex = 0;
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteEl.style.opacity = '0';
        authorEl.style.opacity = '0';
        setTimeout(() => {
            quoteEl.textContent = '"' + quotes[quoteIndex].text + '"';
            authorEl.textContent = '— ' + quotes[quoteIndex].author;
            quoteEl.style.opacity = '1';
            authorEl.style.opacity = '1';
        }, 300);
    }, 5000);
}

/* ---------- View & Download Handlers ---------- */
function viewPDF(name, url) {
    if (!url || url === '#') {
        showToast('Link not available yet');
        return;
    }

    // Create modal if not exists
    let modal = document.getElementById('pdf-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pdf-modal';
        modal.className = 'pdf-modal';
        modal.innerHTML = 
            '<div class="pdf-modal-header">' +
                '<span class="pdf-modal-title" id="pdf-modal-title">PDF Viewer</span>' +
                '<button class="pdf-modal-close" onclick="closePDF()">' +
                    '<i class="fas fa-times"></i> Close' +
                '</button>' +
            '</div>' +
            '<div class="pdf-viewer-container">' +
                '<div class="pdf-loading" id="pdf-loading">' +
                    '<div class="pdf-loading-spinner"></div>' +
                    '<p>Loading PDF...</p>' +
                '</div>' +
                '<iframe class="pdf-viewer-frame" id="pdf-viewer-frame" src="" frameborder="0" onload="hidePDFLoading()"></iframe>' +
            '</div>';
        document.body.appendChild(modal);
    }

    // Show loading, hide iframe initially
    const loading = document.getElementById('pdf-loading');
    const frame = document.getElementById('pdf-viewer-frame');
    if (loading) loading.classList.remove('hidden');
    if (frame) frame.style.opacity = '0';

    document.getElementById('pdf-modal-title').textContent = name;

    // Use Google Drive viewer for viewing (no download popup)
    const driveId = extractDriveId(url);
    if (driveId) {
        frame.src = 'https://drive.google.com/file/d/' + driveId + '/preview';
    } else {
        frame.src = url;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hidePDFLoading() {
    const loading = document.getElementById('pdf-loading');
    const frame = document.getElementById('pdf-viewer-frame');
    if (loading) loading.classList.add('hidden');
    if (frame) {
        frame.style.opacity = '1';
        frame.style.transition = 'opacity 0.3s ease';
    }
}

function extractDriveId(url) {
    // Extract ID from Google Drive URLs
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    const match2 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match2) return match2[1];
    return null;
}

function closePDF() {
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.classList.remove('active');
        const frame = document.getElementById('pdf-viewer-frame');
        if (frame) frame.src = '';
        document.body.style.overflow = '';
    }
}

function downloadFile(btn, name, url) {
    if (!url || url === '#') {
        showToast('Link not available yet');
        return;
    }

    showToast('Starting download...');

    // For Google Drive, use direct download link
    const driveId = extractDriveId(url);
    if (driveId) {
        const downloadUrl = 'https://drive.google.com/uc?export=download&id=' + driveId;
        // Create temporary anchor for download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = name + '.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        window.open(url, '_blank');
    }
}

/* ---------- URL Helpers ---------- */
function getParam(name) {
    return new URLSearchParams(location.search).get(name);
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Set both the top back bar link and the floating back button
function setBackLinks(href) {
    const ids = ['back-link', 'back-link-float'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', href);
    });
}

/* ===========================================================
   SUBJECTS PAGE (subjects.html)
   Reads ?class=11&subject=physics
   =========================================================== */
function initSubjectsPage() {
    const cls = getParam('class') || '11';
    const subject = (getParam('subject') || 'physics').toLowerCase();
    const className = 'Class ' + cls;
    const subjectName = capitalize(subject);
    const isBiology = subject === 'biology';

    // Titles
    const titleEl = document.getElementById('subject-title');
    if (titleEl) titleEl.textContent = subjectName;
    document.title = subjectName + ' - ' + className + ' | Blink';

    // Breadcrumb
    const bcClass = document.getElementById('bc-class');
    if (bcClass) {
        bcClass.textContent = className;
        bcClass.href = 'class' + cls + '.html';
    }
    const bcCurrent = document.getElementById('bc-current');
    if (bcCurrent) bcCurrent.textContent = subjectName;

    // Back button -> class page
    setBackLinks('class' + cls + '.html');

    // Hide formula sheet for Biology
    const formulaCard = document.getElementById('formula-card');
    if (formulaCard) formulaCard.style.display = isBiology ? 'none' : 'block';

    // Build category links so they carry class+subject forward
    const base = '?class=' + cls + '&subject=' + subject;
    document.querySelectorAll('.category-card[data-category]').forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat === 'pyq') {
            // PYQ goes to exam selection page
            card.setAttribute('href', 'pyq.html' + base);
        } else {
            card.setAttribute('href', 'files.html' + base + '&category=' + cat);
        }
    });
}

/* ===========================================================
   PYQ EXAM PAGE (pyq.html)
   Reads ?class=11&subject=physics
   =========================================================== */
function initPyqPage() {
    const cls = getParam('class') || '11';
    const subject = (getParam('subject') || 'physics').toLowerCase();
    const className = 'Class ' + cls;
    const subjectName = capitalize(subject);

    document.title = subjectName + ' PYQ - ' + className + ' | Blink';

    const bcClass = document.getElementById('bc-class');
    if (bcClass) { bcClass.textContent = className; bcClass.href = 'class' + cls + '.html'; }

    const bcSubject = document.getElementById('bc-subject');
    if (bcSubject) {
        bcSubject.textContent = subjectName;
        bcSubject.href = 'subjects.html?class=' + cls + '&subject=' + subject;
    }

    setBackLinks('subjects.html?class=' + cls + '&subject=' + subject);

    const base = '?class=' + cls + '&subject=' + subject;
    document.querySelectorAll('.exam-card[data-category]').forEach(card => {
        const cat = card.getAttribute('data-category');
        card.setAttribute('href', 'files.html' + base + '&category=' + cat);
    });
}

/* ===========================================================
   FILES PAGE (files.html)
   Reads ?class=11&subject=physics&category=notes
   =========================================================== */
const CATEGORY_NAMES = {
    'notes': 'Notes',
    'short-notes': 'Short Notes',
    'pyq': 'Previous Year Questions',
    'mind-map': 'Mind Maps',
    'formula-sheet': 'Formula Sheet',
    'pyq-neet': 'NEET Previous Year Questions',
    'pyq-jee': 'JEE Main Previous Year Questions',
    'pyq-jee-adv': 'JEE Advanced Previous Year Questions'
};

/* ===========================================================
   ===>  INSERT YOUR FILE LINKS HERE  <===

   FILE_DATA is keyed by:  "class-subject-category"
   e.g. "11-physics-notes", "12-biology-pyq-neet"

   Each entry is a list of files. Put the real download link in `url`
   (a direct PDF link, Google Drive share link, etc.).

   Fields:
     name : title shown to the student
     type : "PDF" | "Image" | "DOC" ... (label only)
     size : file size label
     date : upload date label
     icon : Font Awesome icon (fa-file-pdf, fa-image, fa-file-word ...)
     url  : THE ACTUAL DOWNLOAD/VIEW LINK   <-- paste link here
   =========================================================== */
const FILE_DATA = {
    "12-physics-formula-sheet": [
        { name: 'Electrostatics Formula Sheet', type: 'PDF', size: '1.5 MB', date: 'Jun 24, 2026', icon: 'fa-file-pdf', url: 'https://drive.google.com/uc?export=download&id=15PMQ2-rHtOGutAVZIxS6vTHkeydANtpp' }
    ],
   "12-chemistry-mind-map": [
        { 
            name: 'Biomolecules', 
            type: 'Image', 
            size: '800 KB', 
            date: 'Jun 24, 2026', 
            icon: 'fa-image', 
            url: 'https://drive.google.com/uc?export=download&id=1o6j5JoqzJzdm3t7pfOiUkEnXJoi5wBMG' 
        }
    ],
   "11-physics-mind-map": [
    {  
        name: 'Units & Dimensions', 
        type: 'Image',
        size: '235 KB', 
        date: 'Jun 24, 2026', 
        icon: 'fa-image', 
        url: 'https://drive.google.com/uc?export=download&id=1bk9boefCm3s0v9ZTWT6787awjXKCSW70'
    },
      {
         name: ' vector',
         type: 'Image',
         size: '1.5MB',
         date: 'jun 25, 2026',
         icon: 'fa-image',
         url: 'https://drive.google.com/uc?export=download&id=1L0Dh4ikPEyhfWj-1OdLDIydxPgH9nHHI',
       
    },
      {
         name: ' motion in a straight line ',
         type: 'Image',
         size: '135KB',
         date: 'jun 25, 2026',
         icon: 'fa-image',
         url: 'https://drive.google.com/uc?export=download&id=1lJSpgEqBSZ8cJFQrRnOffs1Ka_8H2dJU',
      },
      {
         name: 'motion in a plane ',
         type: 'Image',
         size: '1.5MB',
         date: ' jun 25,2026',
         icon: 'fa-image',
         url: 'https://drive.google.com/uc?export=download&id=1PzWvRayc4IHtifSf745cI8kesZcNY5SU',
      },
      {
         name: 'Lows of motion ',
         type: 'Image',
         size: '1.2MB',
         date: ' jun 25,2026',
         icon: 'fa-image',
         url: 'https://drive.google.com/uc?export=download&id=1XpgFv2T14gdWH9vWdo9UvLft-I29GZmn',
      },
      {
         name: 'friction',
         type: 'Image',
         size: '1.3MB',
         date: 'jun 26,2026',
         icon: 'fa-image',
         url: 'https://drive.google.com/uc?export=download&id=1qAONmGy1DZY_Ew9LieJArObsm4C_0-ZS',
      },
      {
        name: 'Circular motion',
        type: 'Image',
        size: '1.5MB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1fUwKSWnlSmUkWY-9TY3PbcbVUhSIYnYN',
    },
    {
        name: 'System of particles & rotational motion',
        type: 'Image ',
        size: '1.4MB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1oNMX61asf8BCoD28l3KXiq185OnlzgYD',
    },
      { 
        name: 'Work energy & power', 
        type: 'Image', 
        size: '230 KB', 
        date: 'Jun 25, 2026', 
        icon: 'fa-image', 
        url: 'https://drive.google.com/uc?export=download&id=1JLchOG5aQaSDSQnvQwtaCV9Eamr2WfPu',
    },
     {
        name: 'Gravitation',
        type: 'Image',
        size: '1.5KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=14oVReX3SH-2OGuMbeFEwg6GLFRZ1Xwqy',
    },
     {
        name: 'Machanical properties of solids',
        type: 'Image',
        size: '1.2kB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=12N5iay7TbYF8zlQ3Pq2MfqbKKp37Ld0j',
    },
     {
      name: 'Machanical properties of fluids',
        type: 'Image',
        size: '1.5KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1tUf9S5zwB5fOqooV1D7VT-aM2JOJp-Vm',
    },
     {
        name: 'Thermal properties of matter',
        type: 'Image',
        size: '1.5KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1zmN9LtnKpDoNBqrcX5NTX0cuHEBx-OJ2',
    },
     {
        name: 'Thermodynamics',
        type: 'Image',
        size: '1.3KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1tbLh5xr87Aygv51vJan_LYnYV8po4Gw1',
    },
     {
        name: 'Kinetic theory of gas',
        type: 'Image',
        size: '1.5KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1Pg_KS_7SgurFGuXPwJrsV16vAyBQP7Wy',
    },
     {
        name: 'Oscillation',
        type: 'Image',
        size: '1.5KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1PGUbGBYcUe7nuZDfSaQCtmbFjzNAwlQ-',
    },
     {
        name: 'Waves',
        type: 'Image',
        size: '1.9KB',
        date: 'Jun 26, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1NVZFLAjE-RYfZhjA3k0M3ImYymuiBahF',
    },

],
   '11-chemistry-mind-map': [
    {
        name: 'Mole Concept',
        type: 'Image',
        size: '1.3MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1V9ApSwqNWYuUkHXeU-L9oENc2WDePf7P',
    },
    {
        name: 'Atomic structure',
        type: 'Image',
        size: '1MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1KINeV1WGtwCgzjVSV_ynaxahDBxIsB30',
    },
    {
        name: 'Classification of elements and periodic table',
        type: 'Image',
        size: '1.9MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1P2a7iZ-igWM4o3cwrkyvobjUsvtTQ2sr',
    },
    {
        name: 'Chemical bonding',
        type: 'Image',
        size: '1.4MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=17uR8WBpp9Rx4ihxdg_TE2R18n8CjxwD3',
    },
    {
        name: 'States of matter',
        type: 'Image',
        size: '1.2MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=125ehiZJ2Nln14-ESRS3O-WIl2q2bTu6V',
    },
    {
        name: 'Thermodynamics',
        type: 'Image',
        size: '1.5MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1gH0C9sjBUPwbdRh7ETNCusrPxXBNUsrx',
    },
    {
        name: 'Chemical equilibrium',
        type: 'Image',
        size: '1.3MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=18RYefaGq_CskLkAk2Tm14UCQAvvmcLL6',
    },
    {
        name: 'Hydrogen',
        type: 'Image',
        size: '1.7MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1ARloGLB6XjFoGH5-UwZe-GAic0yvElzm',
    },
    {
        name: 'S-block',
        type: 'Image',
        size: '1.4MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=14EhT1VX5tcrrwyo310dinzsbEmY22wqe',
    },
    {
        name: 'P-block (13 & 14)',
        type: 'Image',
        size: '1.3MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1P_82YRiVeZt_oKtVAkEGSZlmLqVnz3sl',
    },
    {
        name: 'Goc',
        type: 'Image',
        size: '1.2MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1AxnibySqIXx0v6pB05b8QGGkkZFe3km3',
    },
    {
        name: 'Hydrocarbon',
        type: 'Image',
        size: '1.4MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1nfxQMfPgD2M-TczRsI2bB7jtc9DAxIEr',
    },
    {
        name: 'Environment chemistry',
        type: 'Image',
        size: '1MB',
        date: 'Jun 27, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1MHW_v3asdb7nOAUrC_kNF5w20xcvI1Gg',
    }
],
'11-math-mind-map': [
    {
        name: 'Sets',
        type: 'Image',
        size: '1MB',
        date: 'Jun 30, 2026',
        icon: 'fa-image',
        url: 'https://drive.google.com/uc?export=download&id=1ooKlsF2nsO1RGHBLJgscCR-QliHiAKLK'
    },
],

  
};

function initFilesPage() {
    const cls = getParam('class') || '11';
    const subject = (getParam('subject') || 'physics').toLowerCase();
    const category = getParam('category') || 'notes';
    const className = 'Class ' + cls;
    const subjectName = capitalize(subject);
    const categoryName = CATEGORY_NAMES[category] || 'Files';

    document.title = categoryName + ' - ' + subjectName + ' | Blink';

    const titleEl = document.getElementById('files-title');
    if (titleEl) titleEl.textContent = categoryName;

    // Breadcrumb
    const bcClass = document.getElementById('bc-class');
    if (bcClass) { bcClass.textContent = className; bcClass.href = 'class' + cls + '.html'; }

    const bcSubject = document.getElementById('bc-subject');
    if (bcSubject) {
        bcSubject.textContent = subjectName;
        bcSubject.href = 'subjects.html?class=' + cls + '&subject=' + subject;
    }

    const bcCurrent = document.getElementById('bc-current');
    if (bcCurrent) bcCurrent.textContent = categoryName;

    // Back button -> subjects page
    setBackLinks('subjects.html?class=' + cls + '&subject=' + subject);

    // Render file list for this class/subject/category
    renderFileList(cls, subject, category);
}

function renderFileList(cls, subject, category) {
    const container = document.getElementById('file-list-container');
    if (!container) return;
    container.innerHTML = '';

    const key = cls + '-' + subject + '-' + category;
    const files = FILE_DATA[key] || [];

    if (files.length === 0) {
        container.innerHTML =
            '<div class="file-item" style="justify-content:center;">' +
                '<div class="file-details" style="text-align:center;">' +
                    '<h4>No files uploaded yet</h4>' +
                    '<span>Check back soon - materials are added regularly.</span>' +
                '</div>' +
            '</div>';
        return;
    }

    files.forEach(f => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML =
            '<div class="file-info">' +
                '<div class="file-icon"><i class="fas ' + f.icon + '"></i></div>' +
                '<div class="file-details">' +
                    '<h4>' + f.name + '</h4>' +
                    '<span>' + f.type + ' • ' + f.size + ' • Uploaded on ' + f.date + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="file-actions">' +
                '<button class="view-btn"><i class="fas fa-eye"></i> View</button>' +
                '<button class="download-btn"><i class="fas fa-download"></i> Download</button>' +
            '</div>';

        const viewBtn = item.querySelector('.view-btn');
        viewBtn.addEventListener('click', () => viewPDF(f.name, f.url));

        const dlBtn = item.querySelector('.download-btn');
        dlBtn.addEventListener('click', () => downloadFile(dlBtn, f.name, f.url));

        container.appendChild(item);
    });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    highlightActiveNav();
    startQuoteRotation();

    const page = document.body.getAttribute('data-page');
    if (page === 'subjects') initSubjectsPage();
    if (page === 'pyq') initPyqPage();
    if (page === 'files') initFilesPage();
});
