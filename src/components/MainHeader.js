import React from 'react'
import styled from 'styled-components'

import { headerFill, header } from 'context/responsive/cssSizes'
import logo from 'assets/logo.png'

const Sticker = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
`
const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center

    height: ${p => p.height};
    width: 100%;
    
    background-color: ${props => props.theme.colors.headerBackground};
    border-bottom: .1rem solid ${props => props.theme.colors.border};
    
`
const Filler = styled.div`
    height: ${p => p.height};
    width: 100%;
    z-index: 10;
`
const StyledImg = styled.img`
    display: block;
    margin: auto;
`

export default function MainHeader() {
    return (
        <Sticker>
            <HeaderWrapper height={header}>
                <StyledImg src={logo} alt="logo" />
            </HeaderWrapper>
            <Filler height={headerFill}/>
        </Sticker>
    )
}