/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `TaskAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskAssignment" DROP CONSTRAINT "TaskAssignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAssignment" DROP CONSTRAINT "TaskAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dueDate",
ADD COLUMN     "endDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "TaskAssignment";
