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
      { path: '/panel-usuario/',     url: 'panel-usuario.html',  }

    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    email="manuel@gmail.com";
    password="123456";
    //promesa
    aut();
    db=firebase.firestore();
    sembrado();
 
});




// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized

})

$$(document).on('page:init', '.page[data-name="acceso"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bAcceso').on('click',fnAcceso);
})

$$(document).on('page:init', '.page[data-name="acceso"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bAcceso').on('click',fnAcceso);


})

$$(document).on('page:init', '.page[data-name="registro especialistas"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('#bRegistroEspecialistas').on('click',fnRegistroEspecialistas);


})



// Option 2. Using live 'page:about' event handlers for each page
$$(document).on('page:init', '.page[data-name="especialistas"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    alert('plantas');
})


  
function fnRegistroEspecialistas(){
  email=$$('#rEmailEspecialistas').val();
  password=$$('#rContraseñaEspecialistas').val();
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    $$('#rMensajeEspecialistas').html("Bienvenido al sistema de citas del Centro Odontologico LAFU");
    console.log("Usuario Ingresado");
   mainView.router.navigate('/panel-usuario/');
 
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
     $$('#rMensajePacientes').html("Ocurrió un error "+mensaje);
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

