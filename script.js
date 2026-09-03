const internshipList =
    document.getElementById("internship-list");

const searchInput =
    document.getElementById("search");

const domainSelect =
    document.getElementById("domain");


function displayInternships(list) {

    internshipList.innerHTML = "";

    if (list.length === 0) {

        internshipList.innerHTML = `
            <div class="empty-state">
                <h2>No internships found</h2>
                <p>
                    Try changing your search or domain filter.
                </p>
            </div>
        `;

        return;
    }

    list.forEach(internship => {

        const card = document.createElement("article");

        card.className = "internship-card";

        card.innerHTML = `
            <h2>${internship.title}</h2>

            <h3>${internship.company}</h3>

            <p>
                <strong>Domain:</strong>
                ${internship.domain}
            </p>

            <p>
                <strong>Location:</strong>
                ${internship.location}
            </p>

            <p>
                <strong>Stipend:</strong>
                ${internship.stipend}
            </p>

            <button type="button">
                View Details
            </button>
        `;

        internshipList.appendChild(card);
    });
}


function filterInternships() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedDomain =
        domainSelect.value;

    const filtered =
        internships.filter(internship => {

            const matchesSearch =
                internship.title
                    .toLowerCase()
                    .includes(searchText)
                ||
                internship.company
                    .toLowerCase()
                    .includes(searchText);

            const matchesDomain =
                selectedDomain === "all"
                ||
                internship.domain === selectedDomain;

            return matchesSearch && matchesDomain;
        });

    displayInternships(filtered);
}


searchInput.addEventListener(
    "input",
    filterInternships
);

domainSelect.addEventListener(
    "change",
    filterInternships
);


displayInternships(internships);