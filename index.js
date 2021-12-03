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
    console.log(idPais)
    res.send("Id de pais guardado " + idPais);
});
//customer
app.post("/customer", jsonParser, (req, res, next) => {
    console.log("Agregar nuevo cliente");
    const sql = "insert into customer values (null,"+idPais+",'" + req.body.first_name.toString() + "','" + req.body.last_name.toString() + "','" + req.body.email.toString() + "',(SELECT max(address_id) FROM address)," + req.body.active + ",'" + req.body.create_date + "','" + req.body.last_update + "')";
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
app.get("/customer/email/:correo", (req, res, next) => {
    console.log("Obtener customer  por correo");
    var correo = req.params.correo;
    console.log(correo);
    const sql = "SELECT * FROM customer WHERE email='" + correo+"'" ;
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
//payment
app.post("/payment", jsonParser, (req, res, next) => {
    console.log("Agregar un nuevo pago");
    const sql = "insert into payment values (null," + req.body.customer_id + "," + req.body.staff_id + ",(SELECT max(rental_id) FROM rental)," + req.body.amount + ",'" + req.body.payment_date + "','" + req.body.last_update + "')";
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
    const sql = "insert into film values (null,'" + req.body.title + "','" + req.body.description + "','" + req.body.release_year + "'," + req.body.language_id + "," + req.body.original_language_id + "," + req.body.rental_duration + "," + req.body.rental_rate + "," + req.body.length + "," + req.body.replacement_cost + "," + req.body.rating + ",'" + req.body.special_features + "','" + req.body.last_update + "')";
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
});
app.put("/film/:id", jsonParser, (req, res) => {
    console.log("Actualizar nueva pelicula");
    console.log(req.body);
    var idPelicula = req.params.id;
    console.log(idPelicula);
    const sql = "update film set title='" + req.body.title + "',description='" + req.body.description + "',release_year='" + req.body.release_year + "',language_id=" + req.body.language_id + ",original_language_id=" + req.body.original_language_id + ",rental_duration=" + req.body.rental_duration + ",rental_rate=" + req.body.rental_rate + ",length=" + req.body.length + ",replacement_cost=" + req.body.replacement_cost + ",rating=" + req.body.rating + ",special_features='" + req.body.special_features + "',last_update='" + req.body.last_update + "' where film_id="+idPelicula;
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            //console.log("Result: " + result);
            //res.json(result);
        }
    );
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
    const sql = "DELETE from film WHERE film_id=" + idPelicula ;
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.get("/film/title/:title", (req, res, next) => {
    console.log("Buscar una pelicula por el titulo que tiene");
    var tituloPelicula = req.params.title;
    console.log(tituloPelicula);
    tituloPelicula=tituloPelicula.replace(/&/g," ");
    tituloPelicula=tituloPelicula.toUpperCase();
    const sql = "SELECT f.film_id, " +
    "   f.title, " +
    "   f.description, " +
    "   f.release_year, " +
    "   l.name as language , " +
    "   ol.name as original_language, " +
    "   f.length, " +
    "   f.rating, " +
    "   f.special_features, " +
    "   f.last_update, " +
    "   i.inventory_id, "+
    "   i.store_id "+ 
    " FROM film f " +
    "     LEFT JOIN language l ON ( f.language_id = l.language_id) " +
    "     LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) " +
    "     JOIN inventory i on i.film_id=f.film_id    "+
    " WHERE " +
    "   UPPER(title) LIKE ( '%"+tituloPelicula+"%' ) "+
    "   AND i.store_id="+idPais+" "+
    "   GROUP BY (f.title)";
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
});
app.get("/film/actor/:actor", (req, res, next) => {
    console.log("Buscar una pelicula por actor");
    var actorPelicula = req.params.actor;
    console.log(actorPelicula);
    var full_name=actorPelicula.split("&");
    var n=full_name[0].toUpperCase();
    var a=full_name[1].toUpperCase();
    console.log(a);
    console.log(n);
    const sql = "SELECT f.film_id, "+
    "f.title, "+
    "f.description, "+
    "f.release_year, "+
    "l.name as language , "+
    "ol.name as original_language, "+
    "f.length, "+
    "f.rating, "+
    "f.special_features, "+
    "f.last_update, "+
    "a.first_name, "+
    "a.last_name, "+
    "i.inventory_id, "+
    "i.store_id "+
    "FROM film f "+
    "LEFT JOIN language l ON ( f.language_id = l.language_id) "+
    "LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) "+
    "JOIN inventory i ON i.film_id=f.film_id "+
    "JOIN film_actor fa ON (f.film_id=fa.film_id) "+
    "JOIN actor a ON (a.actor_id=fa.actor_id) "+
    "WHERE "+
    "(a.first_name) LIKE ('%"+n+"%') AND "+
    "(a.last_name) LIKE ('%"+a+"%') AND "+
    "i.store_id="+idPais+" "+
    "GROUP BY (f.title)";
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
        }
    );
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
    const sql = "SELECT i.inventory_id,i.store_id,f.title,f.description,f.rating,f.special_features,f.length,f.rental_rate,f.rental_duration FROM inventory i JOIN film f on i.film_id=f.film_id WHERE inventory_id=" + idPelicula ;
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.send(result);
            //carrito.push(result[0]["inventory_id"]);
            carrito.push(result[0]);
            console.log(carrito);
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
        console.log(carrito[i].inventory_id);
        console.log(carrito[i].title);
        if(carrito[i].inventory_id==idPelicula){
            console.log("Encontrado");
            carrito.splice(i, 1);
            res.send("ok");
        }
    }
});
app.get("/cart", (req, res, next) => {
    console.log("Obtener todos los elementos del carrito");
    res.send(carrito);
});
app.get("/estrenos", (req, res, next) => {
    console.log("Obtener 20 primeros estrenos");
    const sql = "SELECT i.inventory_id,f.film_id,f.title,f.release_year FROM `film` f JOIN inventory i on i.film_id=f.film_id WHERE i.store_id="+idPais+" GROUP BY (f.title) ORDER BY f.release_year DESC LIMIT 20";
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.json(result);
        }
    );
});
app.get("/masRentadasTodosLosTiempos", (req, res, next) => {
    console.log("Obtener 20 mas rentadas de todos los tiempos");
    const sql = "SELECT i.inventory_id,f.title,COUNT(f.title) as rentas FROM rental r JOIN inventory i ON ( r.inventory_id = i.inventory_id) JOIN film f ON ( i.film_id = f.film_id) WHERE i.store_id="+idPais+" GROUP BY f.title ORDER BY rentas DESC LIMIT 20";
    let resultQuery;
    console.log(sql);
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.json(result);
        }
    );
});
app.get("/masRentadasUltimaSemana/:fechas", (req, res, next) => {
    console.log("Obtener 20 mas rentadas ultima semana");
    var fechas = req.params.fechas;
    var fechasA = fechas.split("&");
    console.log(fechasA);
    const sql = "SELECT i.inventory_id,f.title,COUNT(f.title) as rentas FROM rental r JOIN inventory i ON ( r.inventory_id = i.inventory_id) JOIN film f ON ( i.film_id = f.film_id) WHERE i.store_id="+idPais+" AND r.rental_date>'"+fechasA[0]+"' AND r.rental_date<'"+fechasA[1]+"' GROUP BY f.title ORDER BY rentas DESC LIMIT 20";
    console.log(sql);
    let resultQuery;
    conn.query(sql,
        function(err, result) {
            if (err) throw err;
            res.json(result);
        }
    );
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