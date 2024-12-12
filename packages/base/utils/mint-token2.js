import { clusterApiUrl, Connection, createSolanaRpc, Keypair, Transaction } from '@solana/web3.js'

const simulateWalletSendTransactions= async (value) => {
    // const value = {
    //   address:"bb",
    //   data:"A2Vb2nOnlAORJ3PjG/pOGk2Xu2At14ebTtxtkMSHnfC0qDSbg8EvnPorm4/CT/hxpVwbwtLfWcDWxyB5n0TwvQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+0wcDW4qJWGGfOD9ywz5xx+MKDtvSGFSyvYYXnd9GtuttA8l5k57K/bzqrZS/xW1BzGswXnW6atOe9OM4vv9AgMABQxAqmRp81mSeIMzHUbB2k8qv/OJ89nVfXHqARygyqvAq8+wIXzA07QIT7HO9FflXGa6pfqQfPLK2DuGtvRUVNcZARhIJKWAVdAAt1KyHFp9BiDx0ipfOslHABEPcv0uhT2a8s5393hYbZwLtmpgozuNBvHhTLASa4FBpsRkY4a050tX2oqzTa0GaV82hedAKgR/ZQNpq3nRvbC7vKYuDfR7sOhPnhkmc9xd3EJHZkTWqqdik7+SIrqCpT06hRgVqiL2qwbKPLComnwgensuhcOJwYt328DN1SjkGuCmQIAW3gljyyYrRlQrcYmwUL2ZLySFKfpBHjrv5TbY+bXrof3qjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWPHsmiME/FgZvGFBEm+Dad8+ln5qQrZ4NnZwulFOP86HtVgtrlU0CChPxRjoQOvzJDKeksUlZepqLRu/80z+AILCwABAgMEBQcGCAkKPj7G1sHVn2zSAQAAABYAAABidXJuLTIwMjQwNzE2MTA1MjU4NTUy9AEAAAAAAAAKAAAAAAAAAADQ2J4NAAAACQQFBwYBCgwgZwAAAAAAAAY=",
    //   solanaAddress:"EyjAY6rtk7yMXfj1C4JG3yjGS8tzoe9VXynNzwAZAmSx",
    // }
    const transactionBase64 = value?.data

    const getSolSignerFromPrivateKey = (privateKeyBase58) => {
      return Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKeyBase58)))
    }

    const getSolKeypairFromMnemonic = (mnemonic, derivationPath) => {
      const seed = mnemonicToSeedSync(mnemonic)
      const { key } = ed25519.derivePath(derivationPath, seed.toString('hex'))
      return Keypair.fromSeed(key)
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // Recover the transaction by de-serializing it
    const recoveredTransaction = Transaction.from(Buffer.from(transactionBase64, 'base64'))

    // console.log('Recovered the transaction as Alice')
    console.log('recoveredTransaction', recoveredTransaction)
    const secretKey = array_column(walletList, null, 'solanaAddress')?.[value?.solanaAddress]?.type
    // const secretKey = '39QKD5cPEuvgCnKYYPL5QVKydYswosmmw259cmsEAVs3yUgFRsu5EhRUx36eNLGu6ReUtqPwgjN3HHQ9XFmw74iL'
    const UserKeypair = getSolSignerFromPrivateKey(secretKey)
    // const UserKeypair = getSolKeypairFromMnemonic('you rebel expose flee edge hockey fresh betray atom sunny game amount',"m/44'/501'/0'/0'")
    // Partial sign it as Alice
    recoveredTransaction.partialSign(UserKeypair)
    console.log('Signed the transaction as Alice')

    const finalSerializedTransaction = recoveredTransaction.serialize({
      requireAllSignatures: true,
      verifySignatures: true,
    })

    console.log('finalSerializedTransaction', finalSerializedTransaction)
    // 发送交易
    const txid = await connection.sendRawTransaction(finalSerializedTransaction, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    })

    console.log('交易已发送，ID:', txid)

    setIsPopupSign(false)
    setIsSubmit(false)
    setIsClaiming(true)
  }