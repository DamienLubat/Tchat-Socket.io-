var pseudo = prompt('Votre pseudo ?') || 'Utilisateur';

var socket = io.connect();

// On mets en place un écouteur sur le trafic websocket pour la room 'recupererMessages'
socket.on('recupererMessages', function(messages) {
    var html = '';
    for (var i = 0; i < messages.length; i++)
        html += '<div class="line"><b>' + messages[i].pseudo + '</b> : ' + messages[i].message + '</div>';
        document.getElementById('tchat').innerHTML = html;
});

// On mets en place un écouteur sur le trafic websocket pour la room 'recupererNouveauMessage'
socket.on('recupererNouveauMessage', function(message) {
    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+message.pseudo+'</b> : ' + message.message +'</div>';
});

//une fois que l'on a le message que le client veut partager, on envoie le tout au client.
function envoiMessage() {
    var message = document.getElementById('message').value;
    socket.emit('nouveauMessage', {
        'pseudo': pseudo,
        'message': message
    });
    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+pseudo+'</b> : '+message+'</div>';
    document.getElementById('message').value = '';
    return false;
};