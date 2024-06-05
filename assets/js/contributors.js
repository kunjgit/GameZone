(function() {
    const contributorContainer = document.getElementById('contributor');
    const paginationContainer = document.getElementById('pagination');
    const totalContributorsParagraph = document.getElementById('total-contributors');  // fetch total number of contributors for h2 heading

    const owner = 'kunjgit';
    const repoName = 'GameZone';
    const contributorsPerPage = 38;  // for pagination

    let allContributors = [];
    let currentPage = 1;

    // Function to fetch contributors for a given page number
    async function fetchContributors(pageNumber) {
        const perPage = 100; // GitHub API maximum is 100 per page
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
        try {
            let pageNumber = 1;
            while (true) {
                const contributorsData = await fetchContributors(pageNumber);
                if (contributorsData.length === 0) {
                    break;
                }
                allContributors = allContributors.concat(contributorsData);
                pageNumber++;
            }

            displayContributors();
            setupPagination();
            displayTotalContributors();
        } catch (error) {
            console.error(error);
        }
    }

    // Function to display contributors for the current page
    function displayContributors() {
        contributorContainer.innerHTML = '';
        const start = (currentPage - 1) * contributorsPerPage;
        const end = start + contributorsPerPage;
        const contributorsToShow = allContributors.slice(start, end);

        contributorsToShow.forEach((contributor) => {
            const contributorCard = document.createElement('div');
            contributorCard.classList.add('contributor-card');

            const avatarImg = document.createElement('img');
            avatarImg.src = contributor.avatar_url;
            avatarImg.alt = `${contributor.login}'s Picture`;

            const loginLink = document.createElement('a');
            loginLink.href = contributor.html_url;
            loginLink.appendChild(avatarImg);

            contributorCard.appendChild(loginLink);
            contributorContainer.appendChild(contributorCard);
        });
    }

    // Function to setup pagination buttons
    function setupPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(allContributors.length / contributorsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayContributors();
                updatePaginationButtons();
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // Function to update pagination buttons
    function updatePaginationButtons() {
        const buttons = paginationContainer.getElementsByTagName('button');
        for (const button of buttons) {
            button.classList.remove('active');
        }
        buttons[currentPage - 1].classList.add('active');
    }

    // Function to display the total number of contributors
    function displayTotalContributors() {
        totalContributorsParagraph.textContent = `${allContributors.length} contributors so far!`;
    }

    // Fetch all contributors and initialize display
    fetchAllContributors();
})();