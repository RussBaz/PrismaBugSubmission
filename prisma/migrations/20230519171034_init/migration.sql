-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "prismaNow" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dbNow" TIMESTAMP(3) NOT NULL DEFAULT NOW(),

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
