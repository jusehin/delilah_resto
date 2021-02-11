**DESARROLLO WEB FULL STACK**

``PROYECTO 3: DELILAH RESTO - JUAN SEBASTIAN HINCAPIÉ GONZÁLEZ``

El propósito de este proyecto es crear una aplicación que permita a un restaurante crear una base de datos de productos, usuarios y pedidos para llevar trazabilidad del negocio. Además se creará una sesión de administrador para listar, modificar y eliminar los pedidos y productos del sistema. 

**SIGUE ESTAS INSTRUCCIONES PARA INICIAR Y UTILIZAR LA APLICACIÓN DELILAH RESTO:**

1. Abre el programa *XAMPP Control Panel* e inicia los módulos *Apache* y *MySQL*
2. Dirígete en tu navegador a la dirección `http://localhost/phpmyadmin/`
3. Crea una base de datos nueva llamada *delilah_resto*
4. Utiliza la consola SQL de la base de datos delilah_resto y copia los datos encontrados en el archivo *queries.sql* para crear las tablas, relaciones y datos inciales. 
5. Para que el servidor escuche y se inicie utiliza: *npm install*, *cd server*, *nodemon server.js*

Siguiendo estos pasos deberías estar listo para trabajar con los endpoints encontrados en el archivo *server.js*


**SIGUE ESTAS INSTRUCCIONES PARA UTILIZAR LOS ENDPOINTS DE LA APLICACIÓN A TRAVÉS DE POSTMAN**

1. Abre el programa *Postman* para probar las rutas y realizar las operaciones propuestas en el proyecto.


	# 1. REGISTRA UN NUEVO USUARIO 

		Realiza un POST a la ruta `http://localhost:3000/sign_in` incluyendo los siguientes datos en el body:

		{
			"username": "Sagasa",
			"name": "Sara Garcia Salazar",
			"email": "sara@garcia.com",
			"phone": 3018527898,
			"address": "Calle La Ensenada",
			"password": "sara123",
			"admin": 0
		}

		En caso de que se haya realizado el requerimiento correctamente el servidor responderá:
			"Usuario agregado a la base de datos"
	


	# 2. EL NUEVO USUARIO DEBE LISTAR LOS PRODUCTOS

		Para listar los productos el usuario debe iniciar sesión realizando un POST a la ruta `http://localhost:3000/log_in` indicando los siguientes datos en el body: 

		{
			"username": "sagasa",
			"password": "sara123"
		}

		En caso de que se haya realizado el requerimiento correctamente el servidor responderá con una cadena alfanumérica o TOKEN que DEBE COPIARSE E INCLUIRSE en los próximos pedidos a los endpoints, de lo contrario no funcionarán. Recuerda que el TOKEN cambia según el usuario, así que si inicias sesión con un usuario diferente al administrador los permisos no serán los mismos.

		Ahora realiza un pedido GET a la ruta `http://localhost:3000/products` incluyendo en la sección Headers la siguiente información: 

		`Authorization: Bearer TOKEN COPIADO`

		El servidor responderá con el listado de platos activos en la base de datos. 



	# 3. EL NUEVO USUARIO DEBE PODER GENERAR UN NUEVO PEDIDO

		Realizar un pedido POST a la ruta `http://localhost:3000/orders` incluyendo en la sección Headers la siguiente información: 

		`Authorization: Bearer TOKEN COPIADO`

		Indica los siguientes datos en el body: 

			{
				"products":
				[
					{
						"id_product": 1,
						"quantity": 2
					},
					{
						"id_product": 2,
						"quantity": 1
					}
				],
				"paid": 1
			}

		Si el pedido se realiza correctamente el servidor responderá:
			"Tu pedido fue recibido por nuestro personal y se está preparando".

	**PARA LAS SIGUIENTES DOS RUTAS DEBE INICIAR SESIÓN COMO ADMINISTRADOR, LAS CREDENCIALES SON LAS SIGUIENTES:**

		{
			"username": "admin",
			"password": "delilah123"
		}


	# 4. EL USUARIO ADMINISTRADOR DEBE PODER ACTUALIZAR EL ESTADO DEL PEDIDO

		Inicia sesión como administrador, copia el token enviado por el servidor en el Header y realiza un pedido PUT a la ruta `http://localhost:3000/orders/:id` indicando los siguientes datos en el body: 

		{
			"newOrderStatus": 2	
    	}

		* Esta ruta recibe un parámetro variable según el pedido que se vaya a modificar, así que debes conocer el número 	de id del pedido para incluirlo al final de la ruta.

		** newOrderStatus recibe los siguiente parámetros: 
			1: NUEVO
			2: CONFIRMADO
			3: PREPARANDO
			4: ENVIADO
			5: CANCELADO
			6: ENTREGADO


	# 5. EL USUARIO ADMINISTRADOR DEBE PODER CREAR, EDITAR O ELIMINAR LOS PRODUCTOS

	Inicia sesión como administrador, copia el token enviado por el servidor en el Header y realiza los siguientes pedidos: 

		CREAR UN PRODUCTO:

			Realiza un pedido POST a la siguiente ruta: `http://localhost:3000/products` incluyendo los siguientes datos en el body:

			{
				"item": "Quesadillas tres cueros",
				"photo": "https://www.vvsupremo.com/wp-content/uploads/2015/11/900X570_Two-Cheese-Quesadillas.jpg",
				"description": "Tortillas de maiz rellenas de queso americano, queso azul y queso mozzarella",
				"price": 20
			}

			Si el pedido se realiza correctamente el servidor responderá:
			"El nuevo producto ha sido creado en la base de datos de tu restaurante".

		
		EDITAR UN PRODUCTO POR ID: 

			Realiza un pedido PUT a la siguiente ruta: `http://localhost:3000/products/:id` incluyendo los datos modificados en el body:

			{
				"item": "Quesadillas tres cueros",
				"photo": "Three-Quesadillas.jpg",
				"description": "Tres tortillas de maiz rellenas de queso americano, queso azul y queso mozzarella con carne y salsas al gusto",
				"price": 40
    		}

			* Esta ruta recibe un parámetro variable según el producto que se vaya a modificar, así que debes conocer el número de id del producto para incluirlo al final de la ruta.


		ELIMINAR UN PRODUCTO POR ID:

			Realiza un pedido DELETE a la siguiente ruta: `http://localhost:3000/products/:id`

			* Esta ruta recibe un parámetro variable según el producto que se vaya a modificar, así que debes conocer el número de id del producto para incluirlo al final de la ruta.


	# 6. EL USUARIO SIN PERMISOS DE ADMINISTRADOR NO DEBE PODER CREAR, EDITAR, ELIMINAR PRODUCTOS. IGUALMENTE NO PUEDE EDITAR, ELIMINAR O LISTAR PEDIDOS O USUARIOS.

		Inicia sesión como USUARIO SIN PERMISOS DE ADMINISTRADOR, copia el token enviado por el servidor en el Header y realiza los siguientes pedidos:

		CREAR PRODUCTOS

			Realiza un pedido POST a la ruta `http://localhost:3000/products`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

		EDITAR PRODUCTOS

			Realiza un pedido PUT a la ruta `http://localhost:3000/products/:id`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

			* Esta ruta recibe un parámetro variable según el producto que se vaya a modificar, así que debes conocer el número de id del producto para incluirlo al final de la ruta.

		ELIMINAR PRODUCTOS

			Realiza un pedido DELETE a la ruta `http://localhost:3000/products/:id`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

			* Esta ruta recibe un parámetro variable según el producto que se vaya a modificar, así que debes conocer el número de id del producto para incluirlo al final de la ruta.

		EDITAR PEDIDOS 

			Realiza un pedido PUT a la ruta `http://localhost:3000/orders/:id`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

		ELIMINAR PEDIDOS

			Realiza un pedido DELETE a la ruta `http://localhost:3000/orders/:id`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

		LISTAR PEDIDOS

			Realiza un pedido GET a la ruta `http://localhost:3000/orders`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."

		LISTAR USUARIOS

			Realiza un pedido GET a la ruta `http://localhost:3000/users`

			El servidor responderá: 
			"Para acceder a esta ruta debes proporcionar las credenciales de administrador. Intenta de nuevo ingresando como administrador."



Endpoints que necesitan únicamente de autenticación de usuario: 
    (GET) http://localhost:3000/products
	(POST) http://localhost:3000/orders

Endpoints que necesitan de autenticación de usuario y autenticación de administrador:
    (POST) http://localhost:3000/products
    (PUT) http://localhost:3000/products/:id
    (DELETE) http://localhost:3000/products/:id
    (GET) http://localhost:3000/users
    (GET) http://localhost:3000/users/:id
	(GET) http://localhost:3000/orders
	(PUT) http://localhost:3000/orders/1
	(DELETE) http://localhost:3000/orders/1
