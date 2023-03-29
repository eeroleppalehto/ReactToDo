import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Form from '../components/Form'
import userEvent from '@testing-library/user-event'

test('<Form /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createTodo = jest.fn()

  render(<Form addTask={createTodo} />)

  const input = screen.getByRole('textbox')
  const addButton = screen.getByText('Add')

  await user.type(input, 'testing the form')
  await user.click(addButton)

  expect(createTodo.mock.calls).toHaveLength(1)
  expect(createTodo.mock.calls[0][0]).toBe('testing the form')
})