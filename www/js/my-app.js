


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Centro Odontologico LAFU',
    // App id
    id: 'com.priscilla.LAFU',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
     
      { path: '/about/',     url: 'about.html',  },
      { path: '/Acceso/',     url:'acceso.html',  },
      { path: '/index/',     url: 'index.html',  },
      { path: '/Registro Especialistas/',     url: 'registro_especialistas.html',  },
      { path: '/panel-usuario/',     url: 'panel-usuario.html',  },
      { path: '/registro-datos/',     url: 'registro-datos.html',  },
      { path: '/panel-admin/',     url: 'panel-admin.html',  }

    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
/*ok-registro y aut
ok login 
si es admin-- pasar a un panel que liste los usuarios "no admin"--rol:paciente
Si es developer-- pasar a un panel, mostrar sus datos personales*/
var db,email;
var colPersonas;
var rol="paciente";

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
   
  
    db=firebase.firestore();
    colUsuarios=db.collection("Usuarios");
    //sembrado(); 
});




// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
console.log(e);
})

$$(document).on('page:init', '.page[data-name="acceso"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bAcceso').on('click',fnAcceso);
})


$$(document).on('page:init', '.page[data-name="registro especialistas"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bRegistroEspecialistas').on('click',fnRegistroEspecialistas);


})

$$(document).on('page:init', '.page[data-name="registro-datos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bRegistroFin').on('click',fnRegistroFin);


})





$$(document).on('page:init', '.page[data-name="panel-admin"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  colUsuarios.where("rol", "==", "developer")
  .get()
  .then((querySnapshot) => {
      datosCard = ``;
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data().nombre);
          fechadeNacimientoUsuario=doc.data().fechadeNacimiento;alergiasUsuario=doc.data().alergias;
          telefonoUsuario=doc.data().telefono;cirugiasrecientesUsuario=doc.data().cirugias_recientes;
          enfermedades_patologicasUsuario=doc.data().enfermedadespatologicasUsuario;rolUsuario=doc.data().rol;
              emailUsuario = doc.id;


          datosCard += `
          <div class="card">
          <div class="card-header">${nombreUsuario} ${apellidoUsuario}</div>
          <div class="card-content card-content-padding">
          <div class="row">
          <div class="col-100">${telefonoUsuario}</div>
          <div class="col-100"><b>${fechadeNacimientoUsuario}</b></div>
          <div class="col-50">${cirugiasrecientesUsuario}</div>
          <div class="col-50">${enfermedadespatologicasUsuario}</div>
          <div>`;

           


      });

      $$('#listaUsuarios').html(datosCard);

  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });




})

// Option 2. Using live 'page:about' event handlers for each page
$$(document).on('page:init', '.page[data-name="panel-usuario"]', function (e) {


  
  datosCard = `
  <div class="card">
  <div class="card-header">${nombreUsuario} ${apellidoUsuario}</div>
  <div class="card-content card-content-padding">
      <div class="row">
          <div class="col-100">${telefonoUsuario}</div>
          <div class="col-100"><b>${fechadeNacimientoUsuario}</b></div>
          <div class="col-100">${cirugiasrecientesUsuario}</div>
          <div class="col-100">${enfermedadespatologicasUsuario}</div>
          <div class="col-100">${alergiasUsuario}</div>
         
      </div>
  </div>
  <div class="card-footer">ROL: ${rolUsuario}</div>
</div>
`;

$$('#datosUsuario').html(datosCard);




})



function fnRegistroFin(){
  //Identificador
elId=email;
//Recupero datos del formulario
nombre=$$('#rDNombre').val();
apellido=$$('#rDApellido').val();
fechadeNacimiento=$$('#rDFechaNacimiento').val();
alergias=$$('#rDApellido').val();
cirugias_recientes=$$('#rDCirugias').val();
enfermedades_patologicas=$$('#rDEnfermedades').val();
telefono=$$('#rDTelefono').val();

//construcción de objeto de datos JSON
var datos={nombre:nombre,
apellido:apellido, fechadeNacimiento:fechadeNacimiento, alergias:alergias,telefono:telefono,cirugiasrecientes:cirugias_recientes,enfermedadespatologicas:enfermedades_patologicas, rol:rol
}

colUsuarios.doc(elId).set(datos)
.then(function(ok){
  //Se guardó cOrrectamente la BD
console.log("Registro en Base de Datos ok");
mainView.router.navigate('/panel-usuario/');})
.catch(function(e){
  console.log("Error al llenar el formulario "+e);})
}

var  nombreUsuario,
apellidoUsuario,
fechadeNacimientoUsuario,alergiasUsuario,
telefonoUsuario,cirugiasrecientesUsuario,
enfermedadespatologicasUsuario,rolUsuario;

  
function fnRegistroEspecialistas(){
  email=$$('#rEmailEspecialistas').val();
  password=$$('#rContraseñaEspecialistas').val();
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    $$('#rMensajeEspecialistas').html("Bienvenido al sistema de citas del Centro Odontologico LAFU");
    console.log("Usuario Ingresado");
   mainView.router.navigate('/registro-datos/');
 
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error(error+"--"+errorMessage);
    switch(errorCode){
      case "auth/email-already-in-use":mensaje="Email en uso, coloca otro";
       break
      case "auth/weak-password" :mensaje="Clave debil.Coloque otra contraseña";
       break
       default:mensaje="Intente de nuevo";
     }
     $$('#rMensajeEspecialistas').html("Ocurrió un error "+mensaje);
    // ..
  
});
}

function fnAcceso(){
  email=$$('#aEmail').val();
  password=$$('#aContraseña').val();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
    $$('#aMensaje').html("Bienvenido Sistema Centro Odontologico LAFU");
    console.log("Usuario Ingresado");
    //depende del rol del usuario que tiene en la base de datos 
    var docRef = colUsuarios.doc(email);

docRef.get().then((doc) => {
    if (doc.exists) {
        //console.log("Document data:", doc.data());
        nombreUsuario=doc.data().nombre;
        apellidoUsuario=doc.data().apellido;

       fechadeNacimientoUsuario=doc.data().fechadeNacimiento;alergiasUsuario=doc.data().alergias;
       telefonoUsuario=doc.data().telefono;cirugiasrecientesUsuario=doc.data().cirugias_recientes;
       enfermedades_patologicasUsuario=doc.data().enfermedadespatologicasUsuario;rolUsuario=doc.data().rol;

       if(rolUsuario=="admin"){
        mainView.router.navigate('/panel-admin/');
       }
       else{
        mainView.router.navigate('/panel-usuario/');
       }




    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  
})
.catch((error) => {
    console.log("Error getting document:", error);
});
    mainView.router.navigate('/panel-usuario/');
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error(error+"--"+errorMessage);
    switch(errorCode){
      case "auth/wrong-password":mensaje="La clave es incorrecta";
       break
      case "auth/user-not-found" :mensaje="usuario no encontrado";
       break
       default:mensaje="Intente de nuevo";
     }
     $$('#aMensaje').html("Ocurrió un error "+mensaje);
    // ..
  
});
}

function sembrado() {
  
 /* console.log("Iniciando el sembrado de datos");
  var data1={
    nombre:"uno",
    apellido:"admin",
   rol:"admin"
  };
  elId1="uno@admin.com";
  clave1="adminiuno";

  firebase.auth().createUserWithEmailAndPassword(elId1,clave1)
  .then(function(){
  colUsuarios.doc//para set se indica el ID
  (elId1).set(data1)
  .then( function(ok){
    console.log("nuevo ok");})
})

  
  .catch(function(e) {
    console.log("Error" + e);})
 
 

 
 
    
    var data2={
      nombre:"Rosa",
      apellido:"Alva",
     rol: "admin"
    };
    elId2="dos@admin.com";
    clave2="adminidos";

    firebase.auth().createUserWithEmailAndPassword(elId2,clave2)
    .then(function(){
    colUsuarios.doc//para set se indica el ID
    (elId2).set(data2)
    .then( function(ok){
      console.log("nuevo ok");})
  })
  
    
    .catch(function(e) {
      console.log("Error" + e);})
   
   */
  

  
 /* db.collection("personas").add(data)
  .then(function(docRef){
    console.log("Ok! con el ID:"+docRef.id);
  })
  .catch(function(error){
    console.log("Error: " + error);
  })
*/
  console.log("fin de sembrado de datos");
}

