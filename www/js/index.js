$(document).on("pageinit pageshow pagechange", function () {
    //verifica se un utente è loggato e modifica i menu
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            $("#signupMenu").hide();
            $("#signinMenu").hide();
            $("#iscrizioneMenu").show();
            $("#elencoMenu").show();
            $("#signoutMenu").show();
        } else {
            // No user is signed in. 
            $("#signupMenu").show();
            $("#signinMenu").show();
            $("#iscrizioneMenu").hide();
            $("#elencoMenu").hide();
            $("#signoutMenu").hide();
        }
    });
});

// gestione AUTH & sso
$(function () {

    $("#signup").submit(function (event) {
        $.mobile.loading('show');
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                alert(error);
            })
            .then(function (user) {
                // Handle Success here.
                alert('Registrato ' + user);
            });
        $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
        $("[data-role=panel]").panel("close");
        $.mobile.loading('hide');
    });

    $("#signin").submit(function (event) {
        $.mobile.loading('show');
        event.preventDefault();

        var email = $("#email2").val();
        var password = $("#password2").val();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
            })
            .then(function (user) {
                alert('Bentornato ' + firebase.auth().currentUser.email);
                $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
                $("[data-role=panel]").panel("close");
            });
        $.mobile.loading('hide');
    });

    $("#signInFB").click(function () {
        FB.Event.subscribe('auth.authResponseChange', checkLoginState);


    });

    $("#signOut").click(function () {

        $.mobile.loading('show');
        event.preventDefault();

        // logout firebase
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
            $("[data-role=panel]").panel("close");
        }, function (error) {
            // An error happened.
            alert(error);
        });

        // logout facebook
        LoginManager.getInstance().logOut();
        $.mobile.loading('hide');
    });

});

$(function () {
    $("#inserisciGiocatore").submit(function (event) {
        event.preventDefault();

        var myObject = new Object();
        myObject.nome = $("#nome").val();
        myObject.cognome = $("#cognome").val();
        myObject.email = $("#email").val();
        myObject.telefono = $("#telefono").val();

        var json = JSON.stringify(myObject);

        $.ajax({
            url: "https://vital-cathode-156913.firebaseio.com/giocatori.json",
            type: "POST",
            data: json
        })
            .done(function () {
                alert("Tutto ok!");
                $('#inserisciGiocatore')[0].reset();
            })
            .fail(function () {
                alert("Errore!");
                $('#inserisciGiocatore')[0].reset();
            });
    });

    $("#elenco").on("pageshow", function () {
        $("#listaGiocatori").empty();
        $.ajax("https://vital-cathode-156913.firebaseio.com/giocatori.json")
            .done(function (giocatori) {
                $.each(giocatori, function (index, riga) {
                    var testoGiocatore = "";
                    $.each(riga, function (i, datoGiocatore) {
                        testoGiocatore += datoGiocatore + " ";
                    });
                    $("#listaGiocatori").append("<li><a href='#'>" + testoGiocatore + "</a></li>");
                });
            })
            .fail(function () {
                alert("Errore! Prova a ricaricare la pagina...");
            });
    });
});

//facebook 
function isUserEqual(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === facebookAuthResponse.userID) {
                // We don't need to re-auth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

function checkLoginState(event) {
    if (event.authResponse) {
        // User is signed-in Facebook.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(event.authResponse, firebaseUser)) {
                // Build Firebase credential with the Facebook auth token.
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    event.authResponse.accessToken);
                // Sign in with the credential from the Facebook user.
                firebase.auth().signInWithCredential(credential)
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                        alert(error);
                    })
                    .then(function (user) {
                        alert('Bentornato ' + firebase.auth().currentUser.displayName);
                        $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
                        $("[data-role=panel]").panel("close");
                    });
            } else {
                // User is already signed-in Firebase with the correct user.
                alert('Bentornato ' + firebase.auth().currentUser.displayName);
                $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
                $("[data-role=panel]").panel("close");
            }
        });
    } else {
        // User is signed-out of Facebook.
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
            $("[data-role=panel]").panel("close");
        }, function (error) {
            // An error happened.
            alert(error);
        });
        $.mobile.loading('hide');
    }
}

