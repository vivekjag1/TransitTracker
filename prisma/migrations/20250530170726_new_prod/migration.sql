-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Trip" (
    "tripID" SERIAL NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "directions" TEXT[],
    "travelTime" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("tripID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_username_key" ON "Trip"("username");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
