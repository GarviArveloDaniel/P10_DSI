# Práctica 10 - Sesión PE: Ejercicio con sockets

    Desarrolle un cliente y un servidor en Node.js, haciendo uso de sockets, que incorporen la siguiente funcionalidad:
    El cliente debe recibir, desde la línea de comandos, un comando Unix/Linux, además de sus argumentos correspondientes, que ejecutaremos en el servidor.
    El servidor debe recibir la petición del cliente, procesarla, esto es, ejecutar el comando solicitado, y devolver la respuesta del comando al cliente. Para ello, piense que el comando solicitado puede haberse ejecutado correctamente o puede haber fallado, por ejemplo, por no existir o porque se le han pasado unos argumentos no válidos.