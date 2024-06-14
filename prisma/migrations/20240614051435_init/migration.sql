/*
  Warnings:

  - You are about to drop the column `height` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `routes` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `routes` DROP COLUMN `height`,
    DROP COLUMN `lang`,
    ADD COLUMN `latitude` VARCHAR(191) NOT NULL,
    ADD COLUMN `longitude` VARCHAR(191) NOT NULL;
