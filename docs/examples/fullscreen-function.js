var canvas;
var canvasPrev;

document.addEventListener('webkitfullscreenchange', function() {
    canvasPrev = canvas;
    canvas = document.webkitCurrentFullScreenElement;

    if (canvas) {
        canvas.style.position = 'absolute';

        if (window.innerHeight > window.innerWidth) {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        } else {
            canvas.style.width = 'auto';
            canvas.style.height = '100%';
        }
    } else {
        canvasPrev.style.position = 'relative';
        canvasPrev.style.width = 'auto';
        canvasPrev.style.height = 'auto';
    }
});

window.addEventListener('orientationchange', function() {
    if (canvas) {
        switch (window.orientation) {
            case -90:
            case 90:
                canvas.style.width = 'auto';
                canvas.style.height = '100%';
                break;
            default:
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                break;
        }
    }
});