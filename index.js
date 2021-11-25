var express = require("express");
var bodyParser = require('body-parser')
var sha256 = require('js-sha256');
var jwt = require('jsonwebtoken');

var jsonParser = bodyParser.json()

var mysql = require("mysql");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "sakila"
});

var app = express();

var tasks = []

conectarseMySQL();

function conectarseMySQL() {
    conn.connect(
        function(err) {
            if (err) {
                console.log("*********ERROR**********");
                throw err;
            }
            console.log("Connected!");
        }
    );
}

app.get("/", (req, res, next) => {
    res.json("{ 'message': 'Tasks server online'}");
});

app.listen(3000, () => {
    console.log("Servidor HTTP funcionando");
});

var idPais=1;
//store
app.get("/store/:id", (req, res, next) => {
    console.log("Eleccion de la ubicacion de la tienda en que pais esta");
    idPais = req.params.id;
    res.send("Id de pais guardado " + idPais);
});
//customer
app.post("/customer", jsonParser, (req, res, next) => {
    console.log("Agregar nuevo cliente");
    const sql = "insert into customer values (null,"+idPais+",'" + req.body.first_name.toString() + "','" + req.body.last_name.toString() + "','" + req.body.email.toString() + "'," + req.body.addres_id + "," + req.body.active + ",'" + req.body.create_date + "','" + req.body.last_update + "')";
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
    res.send("OK");
});
app.get("/customer/:id", (req, res, next) => {
    console.log("Obtener cliente por customer_id");
    var idCliente = req.params.id;
    const sql = "SELECT * FROM customer WHERE customer_id=" + idCliente ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            res.json(result);
        }
    );
});
app.put("/customer/:id", jsonParser, (req, res) => {
    console.log("Actualizacion de datos de un cliente");
    var idCliente = req.params.id;
    const sql = "update customer set store_id="+req.body.store_id+",first_name='" + req.body.first_name.toString() + "',last_name='" + req.body.last_name.toString() + "',email='" + req.body.email.toString() + "',address_id=" + req.body.addres_id + ",active=" + req.body.active + ",create_date='" + req.body.create_date + "',last_update='" + req.body.last_update + "' where customer_id="+idCliente;
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
        }
    );
});
//payment
app.post("/payment", jsonParser, (req, res, next) => {
    console.log("Agregar un nuevo pago");
    const sql = "insert into payment values (null," + req.body.customer_id + "," + req.body.staff_id + "," + req.body.rental_id + "," + req.body.amount + ",'" + req.body.payment_date + "','" + req.body.last_update + "')";
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
    res.send("OK");
});
app.get("/payment/:id", (req, res, next) => {
    console.log("Obtener un pago por su id");
    var idPago = req.params.id;
    console.log(idPago);
    const sql = "SELECT * FROM payment WHERE payment_id=" + idPago ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.put("/payment/:id", jsonParser, (req, res) => {
    console.log("Actualizar pago");
    var idPago = req.params.id;
    console.log(idPago);
    console.log(req.body);
    const sql = "update payment set customer_id=" + req.body.customer_id + ",staff_id=" + req.body.staff_id + ",rental_id=" + req.body.rental_id + ",amount=" + req.body.amount + ",payment_date='" + req.body.payment_date + "',last_update='" + req.body.last_update + "' where payment_id="+idPago;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
    res.send("OK");
});
//country
app.get("/countries", (req, res, next) => {
    console.log("Obtener un listado de los paises registrados");
    const sql = "SELECT * FROM country";
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
//city
app.get("/cities", (req, res, next) => {
    console.log("Obtener un listado de las ciudades registradas");
    const sql = "SELECT * FROM city";
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
//address
app.get("/addresses", (req, res, next) => {
    console.log("Obtener el listado de las direcciones registradas");
    const sql = "SELECT * FROM address";
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.post("/addresses", jsonParser, (req, res, next) => {
    console.log("Agregar una nueva direccion");
    console.log(req.body);
    const sql = "insert into address values (null,'" + req.body.address + "','" + req.body.address2 + "','" + req.body.district + "'," + req.body.city_id + "," + req.body.postal_code + "," + req.body.phone + ",'" + req.body.last_update + "')";
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
    res.send("OK");
});
app.get("/address/:id", (req, res, next) => {
    console.log("Obtener direccion por su id");
    var idDireccion = req.params.id;
    console.log(idDireccion);
    const sql = "SELECT * FROM address WHERE address_id=" + idDireccion ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
//film
app.post("/film", jsonParser, (req, res, next) => {
    console.log("Registrar nueva pelicula");
    console.log(req.body);
});
app.put("/film", jsonParser, (req, res) => {
    console.log("Actualizar nueva pelicula");
    console.log(req.body);
});
app.get("/film/:id", (req, res, next) => {
    console.log("Obtener nueva pelicula con id");
    var idPelicula = req.params.id;
    console.log(idPelicula);
    const sql = "SELECT * FROM film WHERE film_id=" + idPelicula ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.delete("/film/:id", (req, res, next) => {
    console.log("Eliminar una pelicula por id");
    var idPelicula = req.params.id;
    console.log(idPelicula);

});
app.get("/film/:title", (req, res, next) => {
    console.log("Buscar una pelicula por el titulo que tiene");
    var tituloPelicula = req.params.titile;
    console.log(tituloPelicula);
    const sql = "SELECT * FROM film WHERE title like '%" + tituloPelicula+"%'" ;
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.get("/film/:actor", (req, res, next) => {
    console.log("Buscar una pelicula por actor");
    var actorPelicula = req.params.actor;
    console.log(actorPelicula);
});
//rental
app.post("/rental", jsonParser, (req, res, next) => {
    console.log("Registrar renta");
    console.log(req.body);
    const sql = "insert into rental values (null,'" + req.body.rental_date + "'," + req.body.inventory_id + "," + req.body.customer_id + ",'" + req.body.return_date + "'," + req.body.staff_id + ",'" + req.body.last_update + "')";
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
    res.send("OK");
});
var carrito=[];
app.delete("/cart", (req, res, next) => {
    console.log("Eliminar todos los elementos carrit");
    carrito=[];
});
app.post("/cart/:id", jsonParser, (req, res) => {
    console.log("Agregar pelicula a carrito");
    var idPelicula = req.params.id;
    console.log(idPelicula);
    const sql = "SELECT * FROM film WHERE film_id=" + idPelicula ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
            carrito.push(result[0]);
        }
    );
});
app.delete("/cart/:id", (req, res, next) => {
    console.log("Eliminar pelicula del carrito");
    var idPelicula = req.params.id;
    console.log(idPelicula);
    var i=0;
    console.log("Buscando...");
    for(i=0;i<carrito.length;i++){
        console.log(carrito[i].film_id);
        console.log(carrito[i].title);
        if(carrito[i].film_id==idPelicula){
            console.log("Encontrado");
            carrito.splice(i, 1);
        }
    }
});
app.get("/cart", (req, res, next) => {
    console.log("Obtener todos los elementos del carrito");
    res.send(carrito);
});

/*function obtenerUnRegistroPorIdDeTabla(tabla,nombre_id,id){
    const sql = "SELECT * FROM "+tabla.toString()+" WHERE "+nombre_id+"=" + id ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            console.log("Result: " + result);
        }
    );
    return result;
}*/