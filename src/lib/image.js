// converts a URL of an image into a dataURI
function imageUrlToUri(url) {
    return new Promise((resolve, reject) => {
        // Create an empty canvas and image elements
        var canvas = document.createElement('canvas')
        var img = document.createElement('img')

        img.onload = function () {
            var ctx = canvas.getContext('2d')

            // match size of image
            canvas.width = img.width
            canvas.height = img.height

            // Copy the image contents to the canvas
            ctx.drawImage(img, 0, 0)

            // Get the data-URI formatted image
            resolve(canvas.toDataURL('image/png'))
        }

        img.ononerror = function () {
            reject(new Error('FailedToLoadImage'))
        }

        // canvas is not supported
        if (!canvas.getContext) {
            reject(new Error('CanvasIsNotSupported'))
        } else {
            img.setAttribute('crossOrigin', 'anonymous')
            img.src = url
        }
    })
}

export {
    imageUrlToUri
}