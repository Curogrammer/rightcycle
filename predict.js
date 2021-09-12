const URL = "./model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function initAI() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    console.log(model);
    maxPredictions = model.getTotalClasses();
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(document.getElementById('aiimg'));
    const predictions = [];
    for (let i = 0; i < maxPredictions; i++) {
        predictions.push({
            name: prediction[i].className,
            probability: prediction[i].probability.toFixed(2),
            img: data[i].img,
            index: i
        });
    }
    return predictions.sort((a, b) => {
        return b.probability - a.probability;
    });
}

initAI();
