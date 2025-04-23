-- AlterTable
ALTER TABLE `Post` ADD COLUMN `imgHeight` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NOT NULL;
