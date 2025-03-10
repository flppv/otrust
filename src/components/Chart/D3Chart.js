import React, { useState, useEffect } from "react";
import LineChart from "./D3LineChart";
import { Panel } from "components/UI"
import styled from 'styled-components'
import { borderRadius } from 'context/responsive/cssSizes'
import { useSwap } from 'context/SwapContext'
import { NOMsupplyETH, priceAtSupply, supplyAtPrice } from 'utils/bonding'

const ChartWrapper = styled.div`
    height: 100%;
    min-width: 30rem;
    max-width: 50rem;
    flex-basis: auto; /* default value */
    flex-grow: 1;
`

function supplyToArray(supBegin, supEnd) {
    var dataArray = []
    const dif = supEnd - supBegin
    const n = 100
    for (var i = 0; i < n; i++) {
        dataArray.push(
            { 
                x: supBegin + dif*i/n,
                y: priceAtSupply(supBegin + dif*i/n)
            }
        );
    }

    return dataArray
}

function labelArray(supBegin, supEnd) {
    const paymentETH = NOMsupplyETH(supEnd, supBegin)
    const priceAvg = paymentETH/(supEnd - supBegin)
    const supAvg = supplyAtPrice(priceAvg)
    return { paymentETH, supAvg, priceAvg }
}

const ChartHeader = styled.header`
  font-size: 1.4rem;
  color: #fff;
  height: 3rem;
  line-height: 3rem;
  background: ${props => props.theme.colors.headerBackground};
  text-align: center;
  vertical-align: middle;
  border-radius: ${borderRadius};
`

export default function D3Chart() {
    const { swapSupply } = useSwap()
    
    const [data, setData] = useState(supplyToArray(0, 100000000))
    const [areaData, setAreaData] = useState(supplyToArray(0, 100000000))
    const [labelData, setLabelData] = useState('')

    useEffect(() => {
        if (swapSupply[1]) {
            var digitsUpper = Math.floor(Math.log10(swapSupply[1]))
            // upperBound = 10**(digitsUpper + 1)
            const upperBound = (Math.round(swapSupply[1]/10**digitsUpper) + 1)*10**digitsUpper
            const lowerBound = 0
            setData(
                supplyToArray(
                    lowerBound, 
                    upperBound
                )
            )
            setAreaData(supplyToArray(swapSupply[0], swapSupply[1]))
            setLabelData(labelArray(swapSupply[0], swapSupply[1]))
        }
    },[swapSupply])
    
    
    
    return (
        <ChartWrapper>
            <Panel>
                <ChartHeader>
                    Bonding Curve
                </ChartHeader>
                <LineChart data={data} areaData={areaData} labelData={labelData}/>
            </Panel>
        </ChartWrapper>
    )
}