const jwt = require("jsonwebtoken");
const signature = "123456"
const sequelize = require("./database");


//-----------------------------------------------------FUNCTIONS------------------------------------------------------//

//-----------------AUTHENTICATION, ADMIN, CREDENTIALS-----------------//

function authentication(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verifiedToken = jwt.verify(token, signature);
        console.log(verifiedToken);
        if (verifiedToken) {
            req.userData = verifiedToken.userData;
            next();
        }
    } catch (e) {
        res.status(401).json("Usuario no encontrado en la plataforma. Utiliza la credenciales correctas o un token correcto.");
    }
}

function authenticateAdmin(req, res, next) {
    if (req.userData.admin) {
        return next();
    } else {
        return res.status(401).json("Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador.");
    }
}

function getToken(data) {
    const outcome = jwt.sign(data, signature);
    return outcome;
}

//----------------------------USUARIOS-----------------------------//

function login(req, res, next) {
    const { username, password } = req.body;
    sequelize
        .query(
            "SELECT id, username, admin FROM users WHERE username = ? AND password = ?", {
                replacements: [username, password],
                type: sequelize.QueryTypes.SELECT
            }
        )
        .then(outcome => {
            if (outcome.length != 0) {
                const userData = {
                    id: outcome[0].id,
                    username: outcome[0].username,
                    admin: outcome[0].admin
                };
                req.userData = userData;
                next();
            } else {
                res.status(400).json("Las credenciales ingresadas no son correctas.");
            }
        });
}

//----------------------------PRODUCTOS---------------------------//
function createAProduct(req, res, next) {
    const { item, photo, description, price } = req.body;
    console.log(req.body);
    sequelize
        .query("INSERT INTO products (item, photo, description, price) VALUES (?, ?, ?, ?)", {
            replacements: [item, photo, description, price],
            type: sequelize.QueryTypes.INSERT
        })
        .then(() => {
            next()
        });
}

async function getAProduct(id) {
    let [outcome] = await sequelize.query(
        "SELECT * from `products` WHERE `products`.`id` = ?", { replacements: [id] }
    );
    return outcome[0];
}

function deleteProduct(req, res, next) {
    sequelize
        .query(
            "UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0", {
                replacements: [req.params.id]
            }
        )
        .then(outcome => {
            console.log(outcome);
            next();
        });
}

//---------------------------------ORDERS-------------------------------------------//

function createOrder(req, res, next) {
    const { products, paid } = req.body;
    sequelize
        .query("INSERT INTO orders (id_user,id_state,paid) VALUES (?,?,?)", {
            replacements: [req.userData.id, 1, paid],
            type: sequelize.QueryTypes.INSERT
        })
        .then(outcome => {
            const id_order = outcome[0];
            let newOrder = [];
            products.forEach(product => {
                newOrder.push(
                    sequelize
                    .query(
                        "INSERT INTO order_products(id_order,id_product,quantity) VALUES (?,?,?)", {
                            replacements: [id_order, product.id_product, product.quantity],
                            type: sequelize.QueryTypes.INSERT
                        }
                    )
                    .then(response => {
                        console.log("Producto añadido al pedido realizado por el usuario");
                        next();
                    })
                );
            });
        });
}

function getOrdersToAdmin(req, res, next) {
    sequelize
        .query(
            "SELECT orders.id, states.description as estado_de_orden, orders.date as fecha_de_orden, orders.paid as pago_de_orden, users.name as usuario, users.address as direccion FROM orders INNER JOIN `users` ON `orders`.`id_user` = `users`.`id` INNER JOIN `states` ON `orders`.`id_state` = `states`.`id`", {
                type: sequelize.QueryTypes.SELECT
            }
        )
        .then(outcome => {
            if (outcome.length !== 0) {
                req.orderData = outcome;
                next();
            } else {
                res.status(400).json("No hay pedidos para mostrar.");
            }
        });
}

function getProductsToAdmin(req, res, next) {
    let newProductsArray = [];
    req.orderData.forEach(order => {
        newProductsArray.push(
            sequelize
            .query(
                "SELECT products.item, products.price, order_products.quantity FROM `order_products` INNER JOIN `products` ON products.id = order_products.id_product WHERE id_order = ?", { replacements: [order.id], type: sequelize.QueryTypes.SELECT }
            )
            .then(outcome => {
                order.products = outcome;
                order.total = order.products
                    .map(product => product.price * product.quantity)
                    .reduce((acc, cur) => acc + cur);
            })
            .then(() => {
                next()
            })
        );
    });
}


module.exports = {
    jwt,
    signature,
    authentication,
    authenticateAdmin,
    getToken,
    login,
    createAProduct,
    getAProduct,
    deleteProduct,
    createOrder,
    getOrdersToAdmin,
    getProductsToAdmin
}