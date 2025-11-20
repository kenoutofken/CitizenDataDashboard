# CITIZEN DATA DASHBOARD - A04 - INTEGRATED CODE

By Ken Yau & Raizel Bacani

The purpose of this project is to redesign the health city dashboard for households spending more than 30% of income on housing. It aims to support current Vancouver residents, potential newcomers, policymakers, non-profit organizations, and housing advocates by making complex housing data easier to understand and compare across neighbourhoods. The project will help stakeholders make more informed decisions about housing affordability, community planning, and resource allocation.

Our main goal for this assignment is to create an interface for users to navigate this dataset in an intuitive and user friendly way. This project started with our team identifying issues with the layout and data visualization of the existing data dashboard. We took this analysis and build wireframes and prototypes to showcase our design solution. After receiving feedback on our prototype, we began the process of coding this project using React. Our tech stack for this project includes:

- React
- React Router
- Tailwind CSS
- Recharts
- Leaflet
- Daisy UI

The files contained within this folder represent the completed development of this project. Because this project is created in React, a few requirements and dependencies are needed in order to view the project on a local development server. Instructions on how to download these dependencies is detailed in the next section. Our project has also been uploaded online for testing and viewing at citizen-data-dashboard.vercel.app.

This project focused on the organization, navigation, and visual representation of the data provided by the City of Vancouver. Other elements, such as a header and links to different pages (like related indicators) are created to act as visual representation only, as that falls outside the scope of this redesign.

## INSTRUCTIONS TO VIEW LOCALLY

As noted before, in order to view the included files locally, they need to be run on a local development server. Node.js is required as a prerequisite for this, which can be downloaded on their website at https://nodejs.org/en. Please restart your computer following the installation of Node.js to ensure it is probably integrated as a JavaScript runtime environment for your computer. Following this initial step, here are the steps to run our project locally:

1. Open the project folder on Visual Code Studio (or code editor of your choice)
2. Open the Command Palette or Terminal within your editor
3. Install dependencies by entering the command 'npm install' (this should use Node Package Manager to download all files required to run our project)
4. Start the server by entering the command 'npm run dev'
5. Open the server locally using the provided localhost link

### LIMITATIONS

- The data from this project was downloaded from Vancouver's Open Data site in November, 2025. Because this data is not drawn live off an API, the data may not represent the latest dataset available.
- On the top of the interface, a header was created to visually represent the existing Vancouver Healthy City Dashboard. The links are not functional, and this header is only provided as a visual representation for how our interface can work seamlessly within the existing site as an upgrade to the functionality and organiation to the current site.
- Similarly, the links at the bottom of the page are taken directly off of the existing site. They do not link to the original content, and are provided for visual representation purposes only.

#### ONLINE ACCESS

citizen-data-dashboard.vercel.app
github.com/kenoutofken/CitizenDataDashboard
