function generateMadLib() {
    // Get the values from the form
    const noun1 = document.getElementById('noun1').value;
    const verb1 = document.getElementById('verb1').value;
    const adjective1 = document.getElementById('adjective1').value;
    const adverb1 = document.getElementById('adverb1').value;
    const noun2 = document.getElementById('noun2').value;
    const verb2 = document.getElementById('verb2').value;
    const adjective2 = document.getElementById('adjective2').value;
    const adverb2 = document.getElementById('adverb2').value;

    // Create the story
    const story = `Once upon a time, there was a ${adjective1} ${noun1} that loved to ${verb1} ${adverb1}. 
    Every morning, it would wake up and ${verb2} with its ${adjective2} ${noun2}. 
    One day, they decided to go on an adventure together. They ${verb1} through the forest and ${verb2} over the mountains, 
    always ${adverb1} and ${adverb2}. 
    By the end of the day, they were tired but happy, knowing they had experienced something truly ${adjective1}.`;

    // Display the story
    document.getElementById('madLibStory').textContent = story;
    document.getElementById('story').classList.remove('hidden');
}
