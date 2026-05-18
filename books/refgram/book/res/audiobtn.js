function setupAudioButtons() {
    // Find all audiobtn elements
    const audioBtns = document.querySelectorAll("audiobtn");

    audioBtns.forEach((btn) => {
        const name = btn.innerHTML; // Get the name attribute
        if (!name) return; // Skip if there's no name attribute

        console.log(`Configuring button '${name}'`);

        // Create an <audio> element
        const audio = document.createElement("audio");
        audio.src = `audio/${name}.mp3`; // Set the audio file source
        audio.preload = "auto"; // Preload the audio

        // Create a <button> element
        const playButton = document.createElement("button");
        playButton.classList.add("audio-play-button"); // Add a class to identify the button
        playButton.innerHTML = `🔉`; // Speaker icon

        // Replace the audiobtn element with the new elements
        const wrapper = document.createElement("span");
        wrapper.appendChild(audio);
        wrapper.appendChild(playButton);
        btn.replaceWith(wrapper); // Replace the audiobtn with the wrapper
    });
}

// Delegate click events to the document level
document.addEventListener("click", function (event) {
    // Check if the clicked element is a play button
    const playButton = event.target.closest(".audio-play-button");
    if (!playButton) return;
  
    // Find the associated audio element
    const wrapper = playButton.parentElement;
    const audio = wrapper.querySelector("audio");
  
    // Play or pause the audio
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
});

// Ensure the function is called when the content is loaded or changed
document.addEventListener("DOMContentLoaded", setupAudioButtons);
document.addEventListener("mdbook:content-changed", setupAudioButtons);