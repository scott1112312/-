document.addEventListener('DOMContentLoaded', function() {
    let slides = [
        { img: '1.jpg', caption: '老黑哥' },
        { img: '龟丞相-幼崽.jpg', caption: '龟丞相-幼崽' },
        { img: '龟丞相.jpg', caption: '龟丞相' },
        { img: '激光男.jpg', caption: '激光男' },
        { img: '囚犯.jpg', caption: '囚犯' },
        { img: '憨吃的样你看.jpg', caption: '憨吃的样你看' },
        { img: '老黑鬼曼巴奥特.jpg', caption: '老黑鬼曼巴奥特' },
        { img: '猪女坐骑.jpg', caption: '猪女坐骑' }
        // Add more slides with image paths and captions here
    ];
    let currentIndex = 0;


    function showImage(index) {
        const slider = document.getElementById('image-slider');
        // Clear current slide content
        slider.innerHTML = '';
        // Create new img element
        const img = document.createElement('img');
        img.src = slides[index].img;
        img.style.display = 'block';
        // Create new caption div
        const caption = document.createElement('div');
        caption.textContent = slides[index].caption;
        caption.className = 'caption';
        // Append img and caption to the slider
        slider.appendChild(img);
        slider.appendChild(caption);
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % slides.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showImage(currentIndex);
    }

    document.getElementById('nextBtn').addEventListener('click', nextImage);
    document.getElementById('prevBtn').addEventListener('click', prevImage);

    // Initial display
    showImage(currentIndex);

    // Automatic slide change every 5 seconds
    setInterval(nextImage, 5000);
});
