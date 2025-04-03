/*
  Warnings:

  - You are about to drop the column `follweingId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the `SavePosts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `followingId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_follweingId_fkey`;

-- DropForeignKey
ALTER TABLE `SavePosts` DROP FOREIGN KEY `SavePosts_postId_fkey`;

-- DropForeignKey
ALTER TABLE `SavePosts` DROP FOREIGN KEY `SavePosts_userId_fkey`;

-- DropIndex
DROP INDEX `Follow_follweingId_fkey` ON `Follow`;

-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `follweingId`,
    ADD COLUMN `followingId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `SavePosts`;

-- CreateTable
CREATE TABLE `SavedPosts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
