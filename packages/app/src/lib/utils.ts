import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { JOYSTREAM_SS58_PREFIX } from '@/config'
import { formatUnits, parseUnits } from 'ethers'
import * as dn from 'dnum'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatJoystreamAddress = (address: string) => {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, JOYSTREAM_SS58_PREFIX)
}

export function hapiToJoy(hapi: string | bigint) {
  const asBigint = BigInt(hapi)
  return Number(formatUnits(asBigint, 10))
}

export function joyToHapi(joy: number) {
  return parseUnits(joy.toFixed(10), 10)
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  // minimumSignificantDigits: 2,
  // maximumSignificantDigits: 5,
})
export function formatNumber(n: number | string) {
  const asNumber = Number(n)
  return formatter.format(asNumber)
}

export function formatJoy(amount: bigint | string | dn.Dnum) {
  let dnum: dn.Dnum
  if (typeof amount === 'string') {
    dnum = dn.from(BigInt(amount), 10)
  } else if (typeof amount === 'bigint') {
    dnum = [amount, 10]
  } else {
    dnum = amount
  }

  return `${dn.format(dnum, { compact: true, digits: 2 })} JOY`
}

export function formatEth(amount: bigint | string | dn.Dnum) {
  let dnum: dn.Dnum
  if (typeof amount === 'string') {
    dnum = dn.from(BigInt(amount), 18)
  } else if (typeof amount === 'bigint') {
    dnum = [amount, 18]
  } else {
    dnum = amount
  }

  return `${dn.format(dnum, { compact: true, digits: 5 })} ETH`
}

export function truncateAddress(address: string, length = 6) {
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function isJoyAddress(address: string) {
  try {
    formatJoystreamAddress(address)
    return true
  } catch {
    return false
  }
}
