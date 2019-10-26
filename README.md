## Environment Variables
| Environment Variable | Description | Default Value|
| ---------------------|-------------|--------------|
| POSTGRES_PORT        | database port| 5432        |
|POSTGRES_DB           | database name| postgres    |
|POSTGRES_USER         |database user| postgres|
|POSTGRES_PASSWORD     |database password| mysecretpassword|
## Requirements 
#### PostgresSQL config
* port = 5432
* user = postgres
* dbname = postgres
* password = mysecretpassword

## setting up and running backend locally

#### Install dependency
```
npm install
```

#### it should run in localhost:3001
```
node app.js
```