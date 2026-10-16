const db = require("./db");

const internships = [
    {
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        domain: "Web Development",
        location: "Hyderabad",
        description: "Work on responsive web interfaces and frontend features.",
        stipend: "₹15,000/month",
        duration: "3 months"
    },
    {
        title: "Java Developer Intern",
        company: "CodeWorks",
        domain: "Java",
        location: "Bangalore",
        description: "Develop Java applications and work with backend technologies.",
        stipend: "₹20,000/month",
        duration: "6 months"
    },
    {
        title: "Python Developer Intern",
        company: "AI Labs",
        domain: "Python",
        location: "Chennai",
        description: "Build Python applications and work on programming tasks.",
        stipend: "₹18,000/month",
        duration: "3 months"
    },
    {
        title: "Data Analyst Intern",
        company: "DataTech",
        domain: "Data Science",
        location: "Pune",
        description: "Analyze data and create useful reports and insights.",
        stipend: "₹12,000/month",
        duration: "4 months"
    },
    {
        title: "UI/UX Design Intern",
        company: "Creative Studio",
        domain: "Design",
        location: "Remote",
        description: "Design user-friendly interfaces and improve user experiences.",
        stipend: "₹10,000/month",
        duration: "3 months"
    }
];

const insert = db.prepare(`
    INSERT INTO internships
    (title, company, domain, location, description, stipend, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((records) => {
    for (const internship of records) {
        insert.run(
            internship.title,
            internship.company,
            internship.domain,
            internship.location,
            internship.description,
            internship.stipend,
            internship.duration
        );
    }
});

insertMany(internships);

console.log(`${internships.length} internship records added successfully.`);