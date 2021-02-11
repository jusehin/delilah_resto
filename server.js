const express = require("express");
const server = express();

const cors = require("cors");
const bodyParser = require("body-parser");
server.use(cors(), bodyParser.json());

const sequelize = require("./database");
const functions = require("./functions");


//-----------------------------------------------------ENDPOINTS------------------------------------------------------//

server.listen(3000, () => { console.log("Server listening in 3000 port") });

//----------------------------USERS-----------------------------//

server.post("/sign_in", (req, res) => {
    const { username, name, email, phone, address, password, admin } = req.body;
    sequelize
        .query(
            "INSERT INTO users (username, name, email, phone, address, password, admin) VALUES(?,?,?,?,?,?,?)", {
                replacements: [username, name, email, phone, address, password, admin],
                type: sequelize.QueryTypes.INSERT
            }
        )
        .then(outcome => {
            res.json("Usuario agregado a la base de datos");
        });
});

server.post("/log_in", functions.login, (req, res) => {
    const { userData } = req;
    res.status(200).json(functions.getToken({ userData }));
});

server.get("/users", functions.authentication, functions.authenticateAdmin, (req, res) => {
    sequelize
        .query("SELECT * FROM users", {
            type: sequelize.QueryTypes.SELECT
        })
        .then(outcome => {
            res.json(outcome);
        });
});

server.get("/users/:id", functions.authentication, functions.authenticateAdmin, (req, res) => {
    let idUser = req.params.id;
    sequelize
        .query("SELECT * FROM users WHERE users.id = ?", {
            replacements: [idUser],
            type: sequelize.QueryTypes.SELECT
        })
        .then((outcome) => {
            if (outcome[0]) {
                res.json(outcome[0]);
            } else {
                res.json(`El usuario con el número de id ${idUser} no se encuentra en nuestra base de datos, intenta con un número de id diferente`)
            }
        });
});


//----------------------------PRODUCTS---------------------------//
server.get("/products", functions.authentication, (req, res) => {
    sequelize
        .query("SELECT * FROM products WHERE is_deleted = 0", {
            type: sequelize.QueryTypes.SELECT
        })
        .then(outcome => {
            res.json(outcome);
            console.log(outcome);
        });
});

server.post("/products", functions.authentication, functions.authenticateAdmin, functions.createAProduct, (req, res) => {
    res.json("El nuevo producto ha sido creado en la base de datos de tu restaurante")
});

server.put("/products/:id", functions.authentication, functions.authenticateAdmin, async(req, res) => {
    let productByParams = await functions.getAProduct(req.params.id);
    if (productByParams) {
        const { item, photo, description, price } = req.body;
        console.log(req.body);
        let idProduct = req.params.id;
        sequelize
            .query(
                `UPDATE products SET item = ?, photo = ?, description = ?, price = ? WHERE products . id = ?`, {
                    replacements: [
                        item,
                        photo,
                        description,
                        price,
                        idProduct
                    ],
                    type: sequelize.QueryTypes.UPDATE
                }
            )
            .then(() => {
                res.json(`El producto con el número de id: ${idProduct} fue modificado`)
            });
    } else {
        res.status(400).json("No encontré un producto con ese ID.");
    }
})

server.delete("/products/:id", functions.authentication, functions.authenticateAdmin, functions.deleteProduct, (req, res) => {
    res.json(`El producto con el número de id: ${req.params.id} ha sido eliminado`);
})

//----------------------------ORDERS---------------------------//

server.post("/orders", functions.authentication, functions.createOrder, (req, res) => {
    res.json("Tu pedido fue recibido por nuestro personal y se está preparando")
})

server.get("/orders", functions.authentication, functions.authenticateAdmin, functions.getOrdersToAdmin, functions.getProductsToAdmin, (req, res) => {
    const { orderData } = req;
    res.status(200).json(orderData);
})

server.put("/orders/:id", functions.authentication, functions.authenticateAdmin, (req, res) => {
    const { newOrderStatus } = req.body;
    sequelize
        .query("UPDATE `orders` SET `id_state` = ? WHERE `orders`.`id` = ?", {
            replacements: [newOrderStatus, req.params.id],
            type: sequelize.QueryTypes.UPDATE
        })
        .then(() => {
            res.json(`El pedido de con id número: ${req.params.id} ha sido modificado`);
        });
})

server.delete("/orders/:id", functions.authentication, functions.authenticateAdmin, (req, res) => {
    sequelize
        .query("DELETE FROM `orders` WHERE `orders`.`id` = ?", {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.UPDATE
        })
        .then(() => {
            res.json(`El pedido de con id número: ${req.params.id} ha sido eliminado`);
        });
})