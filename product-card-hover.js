const IMAGE_SETS = {
    'productImgWrap': [
        '/assets/placeholder/index/product-slider/htm-product-card-2.webp',
        '/assets/placeholder/index/product-slider/htm-product-card-3.webp',
        '/assets/placeholder/index/product-slider/htm-product-card-4.webp',
        '/assets/placeholder/index/product-slider/htm-product-card-5.webp',
        '/assets/placeholder/index/product-slider/htm-product-card-6.webp',
    ]
};

const THUMBNAILS = {
    'productImgWrap': '/assets/placeholder/index/product-slider/htm-product-card-thumbnail.webp'
};

const TRANSITION_MS = 125;

document.querySelectorAll('.img-wrap').forEach(wrap => {
    const images = IMAGE_SETS[wrap.id];
    const thumbnail = THUMBNAILS[wrap.id];
    if (!images) return;

    const layerA = wrap.querySelector('.layer-a');
    const layerB = wrap.querySelector('.layer-b');
    const zones  = wrap.querySelectorAll('.zone');
    const card   = wrap.closest('a');

    // Preload all
    images.forEach(src => { new Image().src = src; });
    new Image().src = thumbnail;

    // Build dots
    const dotsEl = document.createElement('div');
    dotsEl.className = 'img-dots';
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'img-dot' + (i === 0 ? ' active' : '');
        dotsEl.appendChild(dot);
    });
    wrap.appendChild(dotsEl);
    const dots = dotsEl.querySelectorAll('.img-dot');

    let current = -1;
    let isTransitioning = false;
    let pendingIndex = null;

    function showImage(index) {
        if (index === current) return;

        if (isTransitioning) {
            pendingIndex = index;
            return;
        }

        current = index;
        isTransitioning = true;

        const src = index === -1 ? thumbnail : images[index];

        layerB.style.transition = 'none';
        layerB.style.backgroundImage = `url('${src}')`;
        layerB.style.opacity = '0';
        layerB.offsetHeight;

        layerB.style.transition = `opacity ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        layerB.style.opacity = '1';

        setTimeout(() => {
            layerA.style.backgroundImage = `url('${src}')`;
            layerB.style.transition = 'none';
            layerB.style.opacity = '0';

            isTransitioning = false;

            if (pendingIndex !== null && pendingIndex !== current) {
                const next = pendingIndex;
                pendingIndex = null;
                showImage(next);
            }
        }, TRANSITION_MS + 10);

        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    zones.forEach((zone, i) => {
        zone.addEventListener('mouseenter', () => showImage(i));
    });

    card.addEventListener('mouseenter', () => showImage(0));
    card.addEventListener('mouseleave', () => {
        current = -2;
        showImage(-1);
    });
});