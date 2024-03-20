import { render, screen } from '@testing-library/react'
import { describe, test } from 'vitest'

import { Header } from '@/base/components/Header.tsx'

describe('header', () => {
  test('「お買い物リスト」のタイトルが表示されていること', () => {
    render(<Header />)

    expect(
      screen.getByRole('heading', { name: 'お買い物リスト' }),
    ).toBeInTheDocument()
  })
})
