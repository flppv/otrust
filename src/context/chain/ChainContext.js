import React, { useState, useEffect, createContext, useContext } from 'react'
import { formatEther } from '@ethersproject/units'
import { useWeb3React } from "@web3-react/core"
import Modal from 'react-modal';

import { NOMCont, BondingCont } from './contracts'

export const ChainContext = createContext()
export const useChain = () => useContext(ChainContext)

export const UpdateChainContext = createContext()
export const useUpdateChain = () => useContext(UpdateChainContext)

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};

function ChainProvider ({children}) {
    const { account, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState()
    const [ETHbalance, setETHBalance] = useState()
    const [NOMbalance, setNOMBalance] = useState()
    const [supplyNOM, setSupplyNOM] = useState()
    const bondContract = BondingCont(library)
    const NOMcontract = NOMCont(library)
    const [currSupply, setCurrSupply] = useState(1000)
    const [pendingTx, setPendingTx] = useState()
    const [waitModal, setWaitModal] = useState(false)

    useEffect(() => {
        // listen for changes on an Ethereum address
        library.on('block', (number) => {
            setBlockNumber(number)
            library
                .getBalance(account)
                .then((ETHbalance) => {
                    setETHBalance(ETHbalance)
                }).catch((err) => {})
            NOMcontract
                .balanceOf(account)
                .then((NOMbalance) => {
                    setNOMBalance(NOMbalance)
                }).catch((err) => {})
            bondContract
                .getSupplyNOM()
                .then((supNOM) => {
                    setSupplyNOM(formatEther(supNOM))
                }).catch((err) => {})
        })
        // remove listener when the component is unmounted
        return () => {
          library.removeAllListeners('block')
        }
        // trigger the effect only on component mount
    }, [NOMcontract, account, bondContract, library])

    useEffect(() => {
        if (pendingTx) {
            setWaitModal(true)
            pendingTx.wait().then(() => {
                setWaitModal(false);
            })
        }
    }, [pendingTx])

    const contextValue = {
        blockNumber,
        bondContract,
        currSupply,
        ETHbalance,
        NOMbalance,
        NOMcontract,
        supplyNOM
    }

    const updateValue = {
        setCurrSupply,
        setPendingTx
    }

    return (
        <UpdateChainContext.Provider value = { updateValue }>
            <ChainContext.Provider value = { contextValue } >
                {children}
                <Modal
                    isOpen={waitModal}
                    contentLabel="Transaction is pending"
                    style={customStyles}
                >
                    <h2>Transaction is in pending</h2>
                </Modal>
            </ChainContext.Provider>
        </UpdateChainContext.Provider>
    )
}

export default ChainProvider
