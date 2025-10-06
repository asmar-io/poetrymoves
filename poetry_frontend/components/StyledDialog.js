import { styled } from 'styled-components'
import Background from '../assets/images/paper_background_2.png'

export const DialogStyled = styled.dialog`
  background-image: url(${Background.src});
  background-size: 100%;
  padding: 2rem;
  width: min(100%, 25rem);

  &::backdrop {
    background: #0008;
  }
`
