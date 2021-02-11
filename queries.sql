-- CREAR TABLAS

CREATE TABLE `delilah_resto`.`users` ( `id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(20) NOT NULL , `name` VARCHAR(100) NOT NULL , `email` VARCHAR(50) NOT NULL , `phone` INT NULL DEFAULT NULL , `address` VARCHAR(50) NOT NULL , `password` VARCHAR(10) NOT NULL DEFAULT '0' , `admin` BOOLEAN NULL DEFAULT FALSE , PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE `delilah_resto`.`products` ( `id` INT NOT NULL AUTO_INCREMENT , `item` VARCHAR(100) NOT NULL , `photo` VARCHAR(255) NULL DEFAULT 'https://www.maestromanolo.es/wp-content/themes/456repair/assets//img/no-product-image.png' , `description` TEXT NOT NULL , `price` INT NOT NULL , `is_deleted` DATE NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE `delilah_resto`.`orders` ( `id` INT NOT NULL AUTO_INCREMENT , `id_user` INT NOT NULL , `id_state` INT NOT NULL , `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP , `paid` BOOLEAN NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE `delilah_resto`.`order_products` ( `id_order` INT NOT NULL , `id_product` INT NOT NULL , `quantity` INT NOT NULL ) ENGINE = InnoDB;

CREATE TABLE `delilah_resto`.`states` ( `id` INT NOT NULL , `description` VARCHAR(30) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;


-- CREAR RELACIONES

ALTER TABLE `orders` ADD FOREIGN KEY (`id_user`) REFERENCES `delilah_resto`.`users`(`id`) ; ALTER TABLE `orders` ADD FOREIGN KEY (`id_state`) REFERENCES `delilah_resto`.`states`(`id`);

ALTER TABLE `order_products` ADD FOREIGN KEY (`id_order`) REFERENCES `delilah_resto`.`orders`(`id`); ALTER TABLE `order_products` ADD FOREIGN KEY (`id_product`) REFERENCES `delilah_resto`.`products`(`id`);

ALTER TABLE `order_products` DROP FOREIGN KEY `order_products_ibfk_1`; ALTER TABLE `order_products` ADD CONSTRAINT `order_products_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `orders`(`id`) ON DELETE CASCADE;


-- CREAR DATOS

INSERT INTO `users` (`id`, `username`, `name`, `email`, `phone`, `address`, `password`, `admin`) VALUES (NULL, 'admin', 'Administrador', 'admin@delilah.com', '3011234567', 'Av Siempre Viva 742', 'delilah123', '1'), (NULL, 'Juanhin', 'Juan Hincapie', 'juan@hincapie.com', '3037892345', 'Calle Hyrule 123', 'juan12', '0');

INSERT INTO `products` (`id`, `item`, `photo`, `description`, `price`, `is_deleted`) VALUES (NULL, 'Papas mexicanas', 'https://www.patatasgomez.com/wp-content/uploads/2019/12/receta-papas-fritas-mexicanas-guacamole-salsa-queso-cheddar-cherrytomate-6.jpg', 'Papas a la francesa, bañadas en guacamole, sour cream, con carne molina y nachos', '30', 0), (NULL, 'Quesadillas tres cueros', 'https://www.vvsupremo.com/wp-content/uploads/2015/11/900X570_Two-Cheese-Quesadillas.jpg', 'Tortillas de maiz rellenas de queso americano, queso azul y queso mozzarella', '20', 0);

INSERT INTO `states` (`id`, `description`) VALUES ('1', 'NUEVO'), ('2', 'CONFIRMADO'), ('3', 'PREPARANDO'), ('4', 'ENVIADO'), ('5', 'CANCELADO'), ('6', 'ENTREGADO');