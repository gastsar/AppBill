/**
 * @jest-environment jsdom
 */

import {screen, waitFor,fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router"
jest.mock("../app/Store", () => mockStore)



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
  
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

  })
})


//test handleClickIconEye ligne 14 containers/Bills.js

describe("When I click on first eye icon", () => {//Lorsque je clique sur l'icône du premier œil
  test("Then modal should open", () => {//Ensuite, la modale devrait s'ouvrir
    Object.defineProperty(window, localStorage, { value: localStorageMock });//simule des données dans le localstorage
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));//on simule en utilisateur connécter de type employé
    const html = BillsUI({ data: bills });//création de la constante la modale facture de l'employé
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {//navigation vers la route bills
      document.body.innerHTML = ROUTES({ pathname });
    };

    const billsContent = new Bills({document,onNavigate,localStorage: localStorageMock,store: null,
    });

    //MOCK de la modale
    $.fn.modal = jest.fn();//affichage de la modale

    //MOCK L'ICÔNE DE CLIC
    const handleClickIconEye = jest.fn(() => {billsContent.handleClickIconEye;});
    const eye = screen.getAllByTestId("icon-eye")[0];

    eye.addEventListener("click", handleClickIconEye);//surveil un événement au click sur l'oeil
    
    fireEvent.click(eye);//click sur l'icone
    expect(handleClickIconEye).toHaveBeenCalled();//vérifie si l'evenement au click a été appeler
    
    expect($.fn.modal).toHaveBeenCalled();// vérifie si la modale est appeler
  
  });
});




// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const newBillBtn  = await screen.getByText("Nouvelle note de frais")
      expect(newBillBtn).toBeTruthy()
      const contentTest  = await screen.getAllByText("Transports")[0]
      expect(contentTest).toBeTruthy()
    })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee',
        email: "employee@test.tld"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })

    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message =  screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
  })