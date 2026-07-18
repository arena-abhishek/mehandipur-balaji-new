generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

mysql -h REDACTED -P REDACTED -u avnadmin -p --ssl-mode=REQUIRED -D mahandipurbalaji

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
}
