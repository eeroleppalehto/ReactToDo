describe('Todo App', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Guest',
      username: 'guest',
      password: 'Q2werty'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('front page can be opened', function() {
    cy.contains('Todo App')
  })

  it('login form can be opened', function() {
    cy.contains('Login').click()
    cy.get('#username').type('guest')
    cy.get('#password').type('Q2werty')
    cy.get('#login').click()

    cy.contains('Guest\'s Todos')
  })

  it('login fails with wrong password', function() {
    cy.contains('Login').click()
    cy.get('#username').type('guest')
    cy.get('#password').type('q2werty')
    cy.get('#login').click()

    cy.get('.error').contains('wrong credentials')

    cy.get('html').should('not.contain', 'Guest\'s Todos')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'guest', password: 'Q2werty' })
    })

    it('can add a todo', function() {
      cy.contains('Add New Todo').click()
      cy.get('#new-todo-input').type('testing cypress')
      cy.get('#add').click()

      cy.contains('testing cypress')
    })

    describe('and a todo exists', function () {
      beforeEach(function () {
        cy.addTodo({
          name: 'commando'
        })
      })
    })

    it('can change to completion state of a todo', function() {
      cy.contains('Add New Todo').click()
      cy.get('#new-todo-input').type('testing cypress')
      cy.get('#add').click()
      cy.get('.test').check().should('be.checked')
    })
  })
})