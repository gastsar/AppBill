
# Débuggez et testez un SaaS RH (Projet 9)

## Compétences évaluées

##### 1) Ecrire des tests unitaires avec JavaScript
##### 2) Rédiger un plan de test end-to-end manuel
##### 3) Débugger une application web avec le Chrome Debugger
##### 4) Ecrire des tests d'intégration avec JavaScript


## Billed bugs and tests TO DO

###  [Bug report] - Bills (views/BillsUI.js)
####  Description

Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.

### To-do

Faire passer le test au vert en réparant la fonctionnalité.


#### - Code initial

```javascript
// Ligne 21
const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}
// Ligne 25
```

#### - Code final

```javascript
const rows = (data) => {
  return (data && data.length) ? data
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map(bill => row(bill))
  .join("") : ""
}
```

###  [Bug report] - Login (container/login.js)

####  Description

Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge (cf. copie d'écran).
### To-do

Faire passer le test au vert en réparant la fonctionnalité.

#### - Code initial

```js
//Ligne 41
 const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,
      status: "connected"}
//Ligne 47
```
#### - Code final

```js
const user = {
      type: "Admin",
      //[Bug report] - Login
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected"
    }
```

###  [Bug report] - Login (containers/NewBill.js)
####  Description

Je suis connecté en tant qu'employé, je saisis une note de frais avec un justificatif qui a une extension différente de jpg, jpeg ou png, j'envoie. J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image. 

Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image. 

##
### To-do

Comportements attendus :

- [ ]  la modale doit afficher l'image.
- [ ]  dans le dashboard, le formulaire correspondant au ticket doit afficher le nom du fichier.

Suggestion : empêcher la saisie d'un document qui a une extension différente de jpg, jpeg ou png au niveau du formulaire du fichier NewBill.js. Indice : cela se passe dans la méthode handleChangeFile...

#### - Code initial

```js
//Ligne 27
```
#### - Code final

```js
  const validFileExtensions = ["jpg", "jpeg", "png"];
    if (!validFileExtensions.includes(file.type.split("/")[1])) {
      const errorMessage = this.document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.innerHTML =
        "Seuls les justificatifs au format JPEG, JPG ou PNG sont acceptés.";
      const fileInput = this.document.querySelector(
        `input[data-testid="file"]`
      );
      fileInput.parentNode.appendChild(errorMessage);
      this.document.querySelector(`input[data-testid="file"]`).value = null;

      return false;
   
    }
```


###  [Bug report] - Dashboard (container/dashboard.js)
####  Description

Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste. 
### To-do

Comportement attendu : pourvoir déplier plusieurs listes, et consulter les tickets de chacune des deux listes.

Pas besoin d'ajouter de tests.

#### - Code initial

```js
//Ligne 132
handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.index === undefined || this.index !== index) this.index = index
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)'})
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      this.counter ++
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter ++
    }

    bills.forEach(bill => {
      $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })

    return bills

  }
//Ligne 155
```
#### - Code final

```js

  handleShowTickets(e, bills, index) {
    // Initialise la variable counter si elle n'est pas définie
    if (this.counter === undefined || this.index !== index) this.counter = 0
   if (this.index === undefined || this.index !== index) this.index = index
   
  
    // Vérifie si la variable counter est paire
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${index}`).css({ transform: 'rotate(0deg)' })
      $(`#status-bills-container${index}`)
        .html(cards(filteredBills(bills, getStatus(index))))
 
      this.counter++
    } else {
      $(`#arrow-icon${index}`).css({ transform: 'rotate(90deg)' })
     
      $(`#status-bills-container${index}`)
      .html('')
 
      this.counter++
    }
  
    // Attache des écouteurs d'événement clic aux factures
    filteredBills(bills, getStatus(index)).forEach(bill => {
      $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })
  
    return bills
  }
  
```

### [Ajout de tests unitaires et d'intégration]
Le rapport de couverture de branche de Jest indique que le fichiers suivants ne sont pas couverts :


- [ ]  composant views/Bills : Le taux de couverture est à 100% néanmoins si tu regardes le premier test il manque la mention “expect”. Ajoute cette mention pour que le test vérifie bien ce que l’on attend de lui.

#### - Code initial

```js
//Ligne 27
```
#### - Code final

```js
   //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
```

- [x]  composant  views/NewBill
- [ ]  composant container/Bills :
    - [ ]  couvrir un maximum de  "statements" c'est simple, il faut qu’après avoir ajouté tes tests unitaires et d’intégration  [le rapport de couverture du fichier container/Bills](http://127.0.0.1:8080/coverage/lcov-report/containers/Bills.js.html) soit vert. Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".
    - [ ]  ajouter un test d'intégration GET Bills. Tu peux t'inspirer de celui qui est fait (signalé en commentaires) pour Dashboard.
- [ ]  composant container/NewBill :
    - [ ]  couvrir un maximum de "statements" : c'est simple, il faut que le rapport de couverture du fichier container/NewBill soit vert (accessible à [cette adresse](http://127.0.0.1:8080/coverage/lcov-report/containers/NewBill.js.html) quand tu auras lancé le serveur). Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".
    - [ ]  ajouter un test d'intégration POST new bill.
- [x]  composant views/VerticalLayout

Respecter la structure des tests unitaires en place : Given  / When / Then avec le résultat attendu. Un exemple est donné dans le squelette du test __tests__/Bills.js

###[Test E2E] - Parcours Employé

Rédiger un plan de test E2E pour le parcours *employé*. Ce plan doit comprendre l'ensemble des scenarios possibles et doit respecter le format habituel.

Source : 

## Annexe 

Outils de tests
Les outils suivant seront utilisés pour réaliser les tests :

- Jest pour réaliser l’ensemble des tests unitaires. 
- Jest DOM pour réaliser des tests d’intégration. Jest DOM permet de répliquer un DOM pour parcourir des pages et ajouter ou supprimer des nœuds.
- Testing Library est utilisée en complément des Jest DOM et facilite la sélection de nœuds.

## Difficultés rencontrées

- La logique de Jest et des mocks pour les tests unitaires 
- L'anglais

