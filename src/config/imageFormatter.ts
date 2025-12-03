export const imageFormatter = async (title: string, content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    let thumbnail = null
    
    if(imgTags.length !== 0) {
        try {

            for (let i = 0; i < imgTags.length; i++) {
                const sourceBase64 = imgTags[i].getAttribute('src');
                const altAttr = imgTags[i].getAttribute('alt');

                const sizeInBytes = (4 * sourceBase64.length) / 3;
                const sizeInKilobytes = sizeInBytes / 1024;
                
                if (sizeInKilobytes > 20000) {
                    return { 
                        statusCode: false,
                        index: i+1
                    };
                }

                if (isBase64(sourceBase64) && !altAttr) {
                  const compressResult = await compressImages(sourceBase64, 0.7);
                  imgTags[i].setAttribute('src', compressResult);
                  imgTags[i].setAttribute('alt', title);
                }

                if (i == 0) {
                    const compressThumbnail = await compressImages(sourceBase64, 0.5, 150);

                    let divElement = document.createElement('div');
                    let imageElement = document.createElement('img');
                    imageElement.setAttribute('src', compressThumbnail);
                    divElement.append(imageElement)
                    thumbnail = divElement.innerHTML
                }
            }

            return {
                statusCode: true,
                html: doc.querySelector('body').innerHTML,
                thumbnail,
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const isBase64 = (base64: string) => {
    const base64Regex = /^(data:image\/[a-zA-Z+]+;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return base64Regex.test(base64);
}

const compressImages = async (sourceBase64: string, quality: number, setWidth?: number): Promise<any> => {
    try {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = sourceBase64;
            img.onload = function() {
                const ratio = img.width / img.height
                let canvas = document.createElement('canvas');
                let width = setWidth ? setWidth : img.width;
                let height = setWidth ? setWidth / ratio : img.height;

                canvas.width = width;
                canvas.height = height;

                let ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    blob => {
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = () => {
                            const base64data = reader.result;
                            resolve(base64data);
                        };
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = function(error) {
                reject(error);
            };
        });
    } catch (error) {
        return false
    }
}
