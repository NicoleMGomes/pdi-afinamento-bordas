import React from 'react'

import { Container } from './styles'

const Header: React.FC = () => {
  return (
    <Container>
      <img src="/icon.png" alt="Ícone de borda"></img>
      <h1>Afinamento de Bordas</h1>
    </Container>
  )
}

export default Header
