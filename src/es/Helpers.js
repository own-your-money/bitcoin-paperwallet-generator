import * as bitcoin from 'bitcoinjs-lib'
// @ts-ignore
import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'

/* global Buffer */

export const getKeyPair = () => {
  return ECPairFactory(ecc).makeRandom({
    // @ts-ignore
    rng: size => Buffer.from(crypto.getRandomValues(new Uint8Array(size)))
  })
}

export const getBitcoinAddress = publicKey => {
  return bitcoin.payments.p2wpkh({
    pubkey: publicKey,
    network: bitcoin.networks.bitcoin
  }).address || false
}

export const testKeyPair = keyPair => {
  const tests = {}
  // test privateKey toWIF + fromWIF
  const keyPairFromWIF = ECPairFactory(ecc).fromWIF(keyPair.toWIF()/* equals privateKey */, bitcoin.networks.bitcoin)
  // @ts-ignore
  tests.toFromWIF = Buffer.from(keyPairFromWIF.privateKey).equals(Buffer.from(keyPair.privateKey))
  // test publicKey pointFromScalar
  const derivedPubkey = ecc.pointFromScalar(keyPairFromWIF.privateKey, true)
  // @ts-ignore
  tests.pointFromScalar = Buffer.from(derivedPubkey).equals(Buffer.from(keyPair.publicKey))
  // test bitcoinAddress matches privateKey
  const bitcoinAddress = getBitcoinAddress(keyPair.publicKey)
  // @ts-ignore
  tests.p2wpkh = bitcoinAddress === getBitcoinAddress(Buffer.from(derivedPubkey)) && bitcoinAddress === getBitcoinAddress(keyPairFromWIF.publicKey)
  if (Object.keys(tests).every(key => tests[key])) return {...tests, result: true}
  return {...tests, error: new Error('Some tests did not pass!'), result: false}
}