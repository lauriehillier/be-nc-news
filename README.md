# Northcoders News API
The API for a social media platform and community where users can post, discuss, and vote on a wide variety of content across numerous topics.
* Hosted: https://lh-nc-news.onrender.com/api/
## Installation
```bash
# Clone 
git clone https://github.com/lauriehillier/be-nc-news.git

# Install dependencies
npm install
```
## Instructions
1. Create two files, one called '.env.test' and one called '.env.development'.
2. In each file, add 'PGDATABASE=database_name', replacing database_name with 'nc_news_test' or 'nc_news' appropriately.
3. Add '.env.*' to the .gitignore file.
```bash
# Create the databases
npm run setup-dbs
# Testing
npm test
# Running locally
npm run seed
npm run start
## Open http://localhost:9090 in your browser
open http://localhost:9090
```
## Technologies
Project created with:
* Node.js version: 21.1.0
* Postgres version: 14.10
