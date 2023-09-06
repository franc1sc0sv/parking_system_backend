-- CreateTable
CREATE TABLE `Parqueo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroParqueo` VARCHAR(191) NOT NULL,
    `sePuedeReservar` BOOLEAN NOT NULL,

    UNIQUE INDEX `Parqueo_numeroParqueo_key`(`numeroParqueo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaInicial` DATETIME(3) NOT NULL,
    `fechaFinal` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `idParqueo` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_idParqueo_fkey` FOREIGN KEY (`idParqueo`) REFERENCES `Parqueo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
