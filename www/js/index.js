$(document).on("pageinit pageshow pagechange", function () {
    //verifica se un utente è loggato
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

$(document).on("pageinit", function () {
    $("[data-role=panel]").panel("close");
});

$(function () {

    $("#signup").submit(function (event) {
        $.mobile.loading('show');
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            alert(error);
        }).catch(function (success) {
            // Handle Success here.
            $("#signupMenu").show();
            $("#signinMenu").show();
            $("#iscrizioneMenu").hide();
            $("#elencoMenu").hide();
            $("#signoutMenu").hide();
            alert(success);
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

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            alert(error);
        }).catch(function (success) {
            // Handle Success here.
            $("#signupMenu").hide();
            $("#signinMenu").hide();
            $("#iscrizioneMenu").show();
            $("#elencoMenu").show();
            $("#signoutMenu").show();
            alert(success);
        });
        $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
        $("[data-role=panel]").panel("close");
        $.mobile.loading('hide');
    });

});

function signOut() {
    $.mobile.loading('show');
    event.preventDefault();

    firebase.auth().signOut().catch(function (error) {
        // Handle Errors here.
        alert(error);
    }).catch(function (success) {

        // Handle Success here.
        $("#signupMenu").show();
        $("#signinMenu").show();
        $("#iscrizioneMenu").hide();
        $("#elencoMenu").hide();
        $("#signoutMenu").hide();
        alert(success);
    });
    $.mobile.changePage("index.html", { transition: "fade", changeHash: false });
    $("[data-role=panel]").panel("close");
    $.mobile.loading('hide');
}

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
