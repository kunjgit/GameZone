(function() {
const contributorContainer = document.getElementById('contributor');

// Replace these with the owner and repository name of the repository
const owner = 'kunjgit';
const repoName = 'GameZone';

// Function to fetch contributors for a given page number
async function fetchContributors(pageNumber) {
    const perPage = 100; // You can adjust this based on your needs
    const url = `https://api.github.com/repos/${owner}/${repoName}/contributors?page=${pageNumber}&per_page=${perPage}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch contributors data. Status code: ${response.status}`);
    }

    const contributorsData = await response.json();
    return contributorsData;
}

// Function to fetch all contributors
async function fetchAllContributors() {
    let allContributors = [];
    let pageNumber = 1;

    try {
        while (true) {
            const contributorsData = await fetchContributors(pageNumber);
            if (contributorsData.length === 0) {
                break;
            }
            allContributors = allContributors.concat(contributorsData);
            pageNumber++;
        }

        // Display contributors in the honeycomb-like layout
        allContributors.forEach((contributor) => {
            const contributorCard = document.createElement('div');
            contributorCard.classList.add('contributor-card');

            const avatarImg = document.createElement('img');
            avatarImg.src = contributor.avatar_url;
            avatarImg.alt = `${contributor.login}'s Picture`;

            const loginLink = document.createElement('a');
            loginLink.href = contributor.html_url;
            loginLink.appendChild(avatarImg);

            contributorCard.appendChild(loginLink);

            contributorContainer.appendChild(contributorCard); // Append the contributor card to the  container
        });
    } catch (error) {
        console.error(error);
    }
}

// Call the function to fetch all contributors and display them in the honeycomb-like layout
fetchAllContributors();
})();