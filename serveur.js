const http = require('http');    /* Insertion du module HTTP*/
const fs = require('fs');    // Insertion du module Fs gestion des fichiers

// Mise en place des variables d'environnement
const dotenv=require('dotenv').config()
const PORT=process.env.PORT||8080
const fichierHTML=process.env.fichierHTML||'index.html'
const fichierCSS=process.env.fichierCSS||'style.css'
const fichierJS=process.env.fichierJS||'client2.js'


//traitement de la requette url du client
const reponseServeur = function (req, res) {
    console.log(req.url)
    switch (req.url) {
        case "/":
            envoieFichier(res,'text/html', fichierHTML)
            break
        case "/index.html":
            envoieFichier(res,'text/html', fichierHTML)
            break
        case "/style.css":
            envoieFichier(res,'text/css',fichierCSS)
            break
        case "/client.js":
            envoieFichier(res,'text/javascript',fichierJS)
            break
        default:
            res.writeHead(404)
            res.end("Page inexistante");
    }
}
let app=http.createServer(reponseServeur);  // Création du serveur avec appel à la fonction reponseServeur si une requête arrive.

// Fonction qui lit les fichiers sur le serveur et de les envoye en réponse.
function envoieFichier(res,type,fichier){
    fs.readFile(`./${fichier}`, 'utf-8', (erreur, content)=> {
        if (!erreur){
            res.writeHead(200, { 'Content-Type': type });
            res.write(content, 'utf8');
        }else{
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.write('Erreur lecture fichier', 'utf8');
        }
    res.end();
})}

// Création d’un tableau permettant de recevoir tous les messages    
let messages = [];

// Insertion de la bibliotheque socket.io et creation du service attaché au serveur app
let io = require('socket.io')(app);

// Mise en place d’un écouteur de message Socket et traitement si connexion.
io.on('connection', (socket)=>{ //ecoute la room
    console.log(`new user : ${socket.id}`);
    socket.emit('recupererMessages', messages); //emettre dans la room 'recupMess', le tab de ancien mess
    //Ecoute les news users
    socket.on('nouveauMessage', (mess)=>{
        messages.push(mess);    //enregistrement a la derneire position
        socket.broadcast.emit('recupererNouveauMessage', mess); //serveur emettre à tous sauf l'emeteur (client) les news mess
    });
});

// Mise en route du serveur sur le port
app.listen(PORT,()=>{console.log(`Mise en place du serveur http://localhost:${PORT}/`);});