/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"

import router from "../app/Router"
jest.mock("../app/Store", () => mockStore)

//gestion page employée
describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock 
  })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  describe("When I am on NewBill Page", () => {

    test("Then the newbill stay on screen", () => {
      //nouvelle note de frais
      const html = NewBillUI()
      document.body.innerHTML = html

      const date = screen.getByTestId("datepicker"); //Champ de la date
      expect(date.value).toBe("");

      const ttc = screen.getByTestId("amount"); //Champ du TTC
      expect(ttc.value).toBe(""); 

      const fichierAdd = screen.getByTestId("file") //Champ du fichier Joint
      expect(fichierAdd.value).toBe("")

      const formNewBill = screen.getByTestId("form-new-bill")
      //je cible le formulaire de la nouvelle note de frais
      expect(formNewBill).toBeTruthy()
      //le formulaire vide apparait correctement
      
      const sendNewBill = jest.fn((e) => e.preventDefault())
      //creation de fonction pour stopper l'action par défaut
      formNewBill.addEventListener("submit", sendNewBill)//ecoute d'évènement
      fireEvent.submit(formNewBill)//simulation de l'évènement
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()//après l'évènement le formulaire reste à l'écran
    })
  })
});

describe("When i download the attached file in the wrong format", () => { 
  
  test ("Then i stay on the newbill and a alert appears", () => {
   
    const html = NewBillUI()          
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ 
      document,
      onNavigate,
      store: null,
      localStorage: window, localStorage,
    })
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
    const fichier = screen.getByTestId("file")
    const testFormat = new File(["test"],"doc.txt", {
    type: "document/txt"
    })
    fichier.addEventListener("change", LoadFile)
    fireEvent.change(fichier, {target: {files: [testFormat]}})
    
    expect(LoadFile).toHaveBeenCalled()
    expect(window.alert).toBeTruthy()
  })
});

describe("When i download the attached file in the correct format ", () => {
  //lorsque je telecharge le fichier joint dans le bon format
  test ("Then the newbill is send", () => {
    //mon champ est validé et ma NewBill est envoyé

    const html = NewBillUI()         
    document.body.innerHTML = html
    const onNavigate = (pathname) => {  
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ //je crée une nouvelle instance newbill
      document,
      onNavigate,
      store: mockStore,
      localStorage: window, localStorage,
    })
    //création constante pour fonction qui appel la fonction a tester
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))//chargement du fichier
    
    const fichier = screen.getByTestId("file")//cible le champ fichier
    const testFormat = new File(["c'est un test"],  "test.jpg", {//condition du test
      type: "image/jpg"
    })
    fichier.addEventListener("change", LoadFile)//écoute évènement
    fireEvent.change(fichier, {target: {files: [testFormat]}})//évènement au change en relation avec la condition du test
    
    expect(LoadFile).toHaveBeenCalled()//je vérifie que le fichier est bien chargé
    expect(fichier.files[0]).toStrictEqual(testFormat)//je vérifie que le fichier téléchargé est bien conforme à la condition du test

    const formNewBill = screen.getByTestId('form-new-bill')//cible le formulaire
    expect(formNewBill).toBeTruthy()

    const sendNewBill = jest.fn((e) => newBill.handleSubmit(e))//simule la fonction
    formNewBill.addEventListener('submit', sendNewBill)//évènement au submit
    fireEvent.submit(formNewBill)//simule l'évènement
    expect(sendNewBill).toHaveBeenCalled()
    expect(screen.getByText('Mes notes de frais')).toBeTruthy()//lorsqu'on créer une nouvelle note de frais on verifie s'il est bien redirigé vers la page d'accueil
  })
});

//Test d'intégration POST
describe('Given I am a user connected as Employee', () => {//Etant donné que je suis un utilisateur connecté en tant que Salarié
  describe("When I submit the form completed", () => {//Lorsque je soumets le formulaire rempli
     test("Then the bill is created", async() => {//Ensuite, la facture est créée

        const html = NewBillUI()
        document.body.innerHTML = html
        
        const onNavigate = (pathname) => {
           document.body.innerHTML = ROUTES({pathname});
        };

       /** */
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee',
              email: "azerty@email.com",
        }))
/** */
        const newBill = new NewBill({
              document,
              onNavigate,
              store: null,
              localStorage: window.localStorage,
        })

        const validBill = {
              type: "Vol",
              name: "Paris Madagascar",
              date: "2023-11-15",
              amount: 1200,
              vat: 200,
              pct: 30,
              commentary: "Commentary",
              fileUrl: "../img/0.jpg",
              fileName: "test.jpg",
              status: "pending"
        };

       
        screen.getByTestId("expense-type").value = validBill.type;
        screen.getByTestId("expense-name").value = validBill.name;
        screen.getByTestId("datepicker").value = validBill.date;
        screen.getByTestId("amount").value = validBill.amount;
        screen.getByTestId("vat").value = validBill.vat;
        screen.getByTestId("pct").value = validBill.pct;
        screen.getByTestId("commentary").value = validBill.commentary;

        newBill.fileName = validBill.fileName
        newBill.fileUrl = validBill.fileUrl;

        newBill.updateBill = jest.fn();
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

        const form = screen.getByTestId("form-new-bill");
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form)

        expect(handleSubmit).toHaveBeenCalled()
        expect(newBill.updateBill).toHaveBeenCalled()
        
     })
     
//test erreur 500
     test('fetches error from an API and fails with 500 error', async () => {//récupère l'erreur d'une API et échoue avec l'erreur 500
        jest.spyOn(mockStore, 'bills')
        jest.spyOn(console, 'error').mockImplementation(() => {})// Prevent Console.error jest error
  
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })
  
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
        document.body.innerHTML = `<div id="root"></div>`
        router()
  
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
           update : () =>  {
              return Promise.reject(new Error('Erreur 500'))
            }
          }
        })
        const newBill = new NewBill({document,  onNavigate, store: mockStore, localStorage: window.localStorage})
      
        // Soumettre le formulaire
        const form = screen.getByTestId('form-new-bill')
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        form.addEventListener('submit', handleSubmit)     
        fireEvent.submit(form)
        await new Promise(process.nextTick)
        expect(console.error).toBeCalled()
      })
  })
});