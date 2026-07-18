npx prisma generate
npx prisma db push
npx prisma db pull

mysql --user=avnadmin --password=REDACTED \
      --host=REDACTED \
      --port=REDACTED \
      technoboat



mysqldump --user=root --password=REDACTED --host=localhost --port=3306 technotboat > /downloads/mydb.mysql
mysqldump --user=root --password=REDACTED --host=localhost --port=3306 technoboat > /Users/piyushkhatri/Downloads/mydb.sql 

mysql --user=avnadmin --password=REDACTED \
      --host=REDACTED \
      --port=REDACTED \
      technoboat < /Users/piyushkhatri/Downloads/mydb.sql 


✅ Host:
REDACTED

✅ Port:
REDACTED

✅ Database name:
mahandipurbalaji

✅ Username:
avnadmin

✅ Password:
REDACTED (see .env / secrets manager)

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user")
}


model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId], map: "Account_userId_fkey")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId], map: "Session_userId_fkey")
}

model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String?   @unique
  emailVerified         DateTime?
  image                 String?
  password              String?
  passwordResetToken    String?   @unique
  passwordResetTokenExp DateTime?
  role                  String?   @default("user")
  accounts              Account[]
  sessions              Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Blog {
  id                   Int       @id @default(autoincrement())
  title                String
  slug                 String    @unique
  content              String    @db.LongText
  metaTitle            String?
  metaDescription      String?
  featuredImage        String?
  featuredImageAltText String?
  authorId             Int
  publishedAt          DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  status               String    @default("draft")
  views                Int       @default(0)
  likes                Int       @default(0)
  tags                 BlogTag[]
  comments             Comment[]

  @@map("Blog")
}

model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  blogs BlogTag[]

  @@map("Tag")
}

model BlogTag {
  blogId Int
  tagId  Int
  blog   Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([blogId, tagId])
  @@index([tagId], map: "BlogTag_tagId_fkey")
  @@map("BlogTag")
}

model Comment {
  id        Int      @id @default(autoincrement())
  blogId    Int
  userId    Int
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  blog      Blog     @relation(fields: [blogId], references: [id], onDelete: Cascade)

  @@index([blogId], map: "Comment_blogId_fkey")
  @@map("Comment")
}

model Lead {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  phone     String
  message   String
  status    String    @default("new")// new, in-progress, completed, or closed
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  logs      LeadLog[]
}

model LeadLog {
  id        String   @id @default(cuid())
  leadId    String
  status    String
  message   String?
  createdAt DateTime @default(now())
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)

  @@index([leadId], map: "LeadLog_leadId_fkey")
}
model Service {
  id          Int      @id @default(autoincrement())
  name        String
    content  String    @db.LongText
  slug       String    @unique
  description String
  icon        String @db.LongText
  status      String   @default("active") // Active, inactive, etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}


