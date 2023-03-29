import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from '../components/Todo'

test('renders content', () => {
  const todo = {
    name: 'Component testing is done with react-testing-library',
    completed: false ,
    created: new Date().toJSON()
  }

  const { container } = render(<Todo name={todo.name} completed={todo.completed} created={todo.created} />)

  const label = container.querySelector('.todo-label')
  expect(label).toHaveTextContent('Component testing is done with react-testing-library')
})

test('clicking the button calls event handler once', async () => {
  const todo = {
    name: 'Component testing is done with react-testing-library',
    completed: false ,
    created: new Date().toJSON()
  }

  const mockHandler = jest.fn()

  const { container } = render(<Todo name={todo.name} completed={false} created={todo.created} toggleTaskCompleted={mockHandler}/>)

  const user = userEvent.setup()
  const checkbox = container.querySelector('.test')
  await user.click(checkbox)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
